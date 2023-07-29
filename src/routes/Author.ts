import express from 'express';
import controller from '../controllers/Author';
import { auth } from '../middleware/auth';
import userController from '../controllers/User';

const router = express.Router();
router.post('/login', userController.loginOne);
router.post('/register', userController.registerOne);
router.post('/create', auth, controller.createAuthor);
router.get('/get/:authorId', auth, controller.readAuthor);
router.get('/get/', auth, controller.readAll);
router.patch('/update/:authorId', controller.updateAuthor);
router.patch('/delete/:authorId', controller.deleteAuthor);

export = router;
