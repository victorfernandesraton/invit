export const countTotalAmmount = (item: any[]) => {
  return item.reduce((prev, curr) => {
    prev += curr?.billing?.price ?? 0

    return prev
  }, 0)
}
