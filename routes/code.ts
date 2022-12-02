import express from 'express';
import passport from '../config/passport';
import codeController from '../controllers/codeController';

const router = express.Router();
const authenticated = passport.authenticate('jwt', { session: false });

router.get('/api/code', authenticated, codeController.getCodeList);
router.post('/api/code', authenticated, codeController.postCode);
router.get('/api/code/:id', codeController.getCode);
router.put('/api/code/:id', authenticated, codeController.updateCode);
router.delete('/api/code/:id', authenticated, codeController.deleteCode);

export { router as codeRouter };