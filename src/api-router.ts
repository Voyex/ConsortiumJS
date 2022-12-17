import { Router } from 'express';
const router: Router = Router();

// Import routes
import loginRoute from './routes/login.route';
import signupRoute from './routes/signup.route';

router.use('/login', loginRoute);
router.use('/signup', signupRoute);

export default router;
