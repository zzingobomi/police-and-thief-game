export interface ICharacterState {
  name: string;

  update(delta: number): void;
  onInputChange(): void;
}
