import type { Request, Response } from 'express';
import { sendJsonWithEtag } from '../../shared/http/etag';
import type { UuidIdParamsSchema } from '../../shared/schemas/id.schema';
import type { CreateOrderBodyDto, ListOrderQueryDto, UpdateOrderBodyDto } from './order.schemas';
import { orderService } from './order.service';

export async function createOrder(req: Request<unknown, unknown, CreateOrderBodyDto>, res: Response) {
  const order = await orderService.create(req.body);
  return res.status(201).json(order);
}

export async function listOrders(req: Request<unknown, unknown, unknown, ListOrderQueryDto>, res: Response) {
  const result = await orderService.list(res.locals.query);

  return sendJsonWithEtag(req, res, result);
}

export async function getOrder(req: Request<UuidIdParamsSchema>, res: Response) {
  const order = await orderService.findById(req.params.id);

  return sendJsonWithEtag(req, res, order);
}

export async function updateOrder(
  req: Request<UuidIdParamsSchema, unknown, UpdateOrderBodyDto>,
  res: Response,
) {
  const order = await orderService.updateById(req.params.id, req.body);
  return res.status(200).json(order);
}

export async function deleteOrder(req: Request<UuidIdParamsSchema>, res: Response) {
  await orderService.deleteById(req.params.id);
  return res.status(204).send();
}
