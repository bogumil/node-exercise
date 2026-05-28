import type { Request, Response } from 'express';
import type { CreateOrderBodyDto, ListOrderQueryDto } from './order.schemas';
import { orderService } from './order.service';

export async function createOrder(req: Request<unknown, unknown, CreateOrderBodyDto>, res: Response) {
  const order = await orderService.create(req.body);
  return res.status(201).json(order);
}

export async function listOrders(_req: Request<unknown, unknown, unknown, ListOrderQueryDto>, res: Response) {
  const result = await orderService.list(res.locals.query);
  return res.status(200).json(result);
}
