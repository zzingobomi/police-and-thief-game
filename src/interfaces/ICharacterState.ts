export interface ICharacterState {
  name: string;
  animationName: string;
  canFindVehiclesToEnter: boolean; // Find a suitable car and run towards it
  canEnterVehicles: boolean; // Actually get into the vehicle
  canLeaveVehicles: boolean;

  update(delta: number): void;
  onInputChange(): void;
}
