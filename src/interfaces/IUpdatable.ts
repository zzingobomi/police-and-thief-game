export interface IUpdatable {
  updateOrder: number;

  update(delta: number): void;
}
