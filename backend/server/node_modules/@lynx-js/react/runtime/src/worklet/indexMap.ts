class IndexMap<T> {
  protected lastIndex = 0;
  protected indexMap: Map<number, T> = new Map();

  public add(value: T): number {
    const index = ++this.lastIndex;
    this.indexMap.set(index, value);
    return index;
  }

  public get(index: number): T | undefined {
    return this.indexMap.get(index);
  }

  public remove(index: number): void {
    this.indexMap.delete(index);
  }
}

export { IndexMap };
