import type { CustomQueryInterface } from '../types';

type ConstructorParams<T> = {
  next: () => Promise<T[]>;
  isLoading: () => boolean;
  hasNext: () => boolean;
};

class CustomQuery<T> implements CustomQueryInterface<T> {
  constructor(private params: ConstructorParams<T>) {}
  get isLoading(): boolean {
    return this.params.isLoading();
  }
  get hasNext(): boolean {
    return this.params.hasNext();
  }
  next() {
    return this.params.next();
  }
}

export default CustomQuery;
