export interface ICharacterState {
  update(delta: number): void;
  onInputChange(): void;
}
