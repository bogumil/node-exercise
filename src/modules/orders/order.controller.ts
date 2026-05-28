import type { Request, Response } from 'express';
import type { CreateOrderBodyDto } from './order.schemas';
import { orderService } from './order.service';

export async function createOrder(req: Request<unknown, unknown, CreateOrderBodyDto>, res: Response) {
  const order = await orderService.create(req.body);
  return res.status(201).json(order);
}
