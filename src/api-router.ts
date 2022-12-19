import { Router } from 'express';
const router: Router = Router();

// Import routes
import loginRoute from './routes/login.route.js';
import signupRoute from './routes/signup.route.js';

router.use('/login', loginRoute);
router.use('/signup', signupRoute);

export default router;
