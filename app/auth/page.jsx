'use client'
import React from 'react';
import { account, ID } from '@/lib/appwrite';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useRouter } from 'next/navigation';
const Page = () => {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState('');
    const router = useRouter();

    const handleRegisterOrLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await account.createEmailPasswordSession(email, password);
            router.push('/');
            setError('');
        } catch (loginError) {
            if (loginError.code === 401) { // Unauthorized, user not found
                try {
                    await account.create(ID.unique(), email, password);
                    await account.createEmailPasswordSession(email, password);
                    router.push('/');
                    setError('');
                } catch (registerError) {
                    setError(registerError.message);
                }
            } else {
                setError(loginError.message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center p-4 bg-black">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Welcome</CardTitle>
                    <CardDescription>Login or create an account to continue</CardDescription>
                </CardHeader>
                <form onSubmit={handleRegisterOrLogin}>
                    <CardContent className="space-y-4">
                        {error && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={loading}
                        >
                            {loading ? 'Please wait...' : 'Continue'}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
};

export default Page;