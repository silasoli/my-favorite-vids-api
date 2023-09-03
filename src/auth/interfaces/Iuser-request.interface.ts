import { IvalidateReturn } from './Ivalidate.interface';

export interface RequestWithUser {
  Request;
  user: IvalidateReturn;
}
