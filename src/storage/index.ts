type StorageObject<T> = {
  timestemp: number
  data: T
}

export abstract class QueryStorage<P, R> {

	constructor(private readonly storageId: string,private readonly minutesCached: number) {}

  protected getStorageData(): StorageObject<R> {
    const value = localStorage.getItem(this.storageId)
    if (!value) {
      throw new Error('not found index')
    }

    try {
      const { data, timestemp }: StorageObject<R> = JSON.parse(value)
      return { data, timestemp }
    } catch (error) {
      throw new Error('error on parse storage')
    }
  }

  private isBigger(passedTime: number) {
    return passedTime + this.minutesCached * (60 * 1000) > new Date().getTime()
  }

  protected setStorageData(value: R) {
    localStorage.setItem(
      this.storageId,
      JSON.stringify({
        data: value,
        timestemp: new Date().getTime(),
      }),
    )
  }

  abstract query(params: P): Promise<R>

  async execute(params: P): Promise<R> {
    try {
      const storageData = this.getStorageData()
      const isBiggr = this.isBigger(storageData.timestemp)
      if (!isBiggr) {
        return storageData.data
      }
      const data = await this.query(params)
      this.setStorageData(data)

      return data
    } catch (error) {
      if (error.message === 'not found index') {
        const data = await this.query(params)
        this.setStorageData(data)

        return data
      }
      throw error
    }
  }

}
