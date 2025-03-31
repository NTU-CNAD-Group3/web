import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function ForgetPasswordEmail() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex min-h-[calc(100vh-65px)] items-center justify-center">
      <Card className="w-full max-w-md bg-primary-foreground">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 20 }}>
              <CheckCircle className="mx-auto h-16 w-16 text-green-500 dark:text-green-400" />
            </motion.div>
            <p className="pt-4">Send Email Success</p>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-600 dark:text-gray-300">
            We have sent you an email with instructions to reset your password.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center space-x-4">
          <Link to="/" className={buttonVariants({ size: 'lg' })}>
            Back to home
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
