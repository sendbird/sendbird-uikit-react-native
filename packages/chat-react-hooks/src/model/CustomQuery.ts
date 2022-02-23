import type { CustomQueryInterface } from '../types';

type ConstructorParams<T> = {
  next: () => Promise<T[]>;
  prev: () => Promise<T[]>;
  isLoading: () => boolean;
  hasNext: () => boolean;
};

class CustomQuery<T> implements CustomQueryInterface<T> {
  constructor(private params: ConstructorParams<T>) {}
  get hasNext(): boolean {
    return this.params.hasNext();
  }
  get isLoading(): boolean {
    return this.params.isLoading();
  }
  next() {
    return this.params.next();
  }
  prev() {
    return this.params.prev();
  }
}

export default CustomQuery;
