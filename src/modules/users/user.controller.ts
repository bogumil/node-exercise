import type { Request, Response } from 'express';
import type { UuidIdParamsSchema } from '../../shared/schemas/id.schema';
import type { CreateUserBodyDto, ListUserQueryDto, UpdateUserBodyDto } from './user.schemas';
import { userService } from './user.service';

export async function createUser(req: Request<unknown, unknown, CreateUserBodyDto>, res: Response) {
  const user = await userService.create(req.body);
  return res.status(201).json(user);
}

export async function getUser(req: Request<UuidIdParamsSchema>, res: Response) {
  const user = await userService.findById(req.params.id);
  return res.status(200).json(user);
}

export async function listUsers(_req: Request<unknown, unknown, unknown, ListUserQueryDto>, res: Response) {
  const result = await userService.list(res.locals.query);
  return res.status(200).json(result);
}

export async function updateUser(
  req: Request<UuidIdParamsSchema, unknown, UpdateUserBodyDto>,
  res: Response,
) {
  const user = await userService.updateById(req.params.id, req.body);
  return res.status(200).json(user);
}

export async function deleteUser(req: Request<UuidIdParamsSchema>, res: Response) {
  await userService.deleteById(req.params.id);
  return res.status(204).send();
}
