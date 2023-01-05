import { Router } from 'express';
import Todo from '../models/Todo';

const router = Router();

router.get('/todo/:id', async (req, res) => {
  const todo = await Todo.findById(req.params.id);

  if (!todo) {
    return res.status(404).json({ message: 'Todo not found' });
  }
  res.json(todo);
});

export default router;
