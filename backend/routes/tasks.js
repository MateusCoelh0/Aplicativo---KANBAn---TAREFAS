import express from 'express';
import Task from '../models/Task.js';
import verifyToken from '../middleware/auth.js';

const router = express.Router();

// Listar todas as tarefas do usuário
router.get('/', verifyToken, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao listar tarefas',
      error: error.message,
    });
  }
});

// Obter uma tarefa específica
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Tarefa não encontrada',
      });
    }

    // Verificar se a tarefa pertence ao usuário
    if (task.userId.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Acesso negado',
      });
    }

    res.json({
      success: true,
      data: task,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao obter tarefa',
      error: error.message,
    });
  }
});

// Criar nova tarefa
router.post('/', verifyToken, async (req, res) => {
  try {
    const { title, description, status, priority, dueDate, assignee } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Título é obrigatório',
      });
    }

    const newTask = new Task({
      userId: req.userId,
      title,
      description,
      status: status || 'todo',
      priority: priority || 'média',
      dueDate,
      assignee,
    });

    await newTask.save();

    res.status(201).json({
      success: true,
      data: newTask,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao criar tarefa',
      error: error.message,
    });
  }
});

// Atualizar tarefa
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Tarefa não encontrada',
      });
    }

    // Verificar se a tarefa pertence ao usuário
    if (task.userId.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Acesso negado',
      });
    }

    const { title, description, status, priority, dueDate, assignee } = req.body;

    if (title) task.title = title;
    if (description !== undefined) task.description = description;
    if (status) task.status = status;
    if (priority) task.priority = priority;
    if (dueDate !== undefined) task.dueDate = dueDate;
    if (assignee !== undefined) task.assignee = assignee;

    await task.save();

    res.json({
      success: true,
      data: task,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar tarefa',
      error: error.message,
    });
  }
});

// Deletar tarefa
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Tarefa não encontrada',
      });
    }

    // Verificar se a tarefa pertence ao usuário
    if (task.userId.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Acesso negado',
      });
    }

    await Task.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Tarefa deletada com sucesso',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao deletar tarefa',
      error: error.message,
    });
  }
});

export default router;
