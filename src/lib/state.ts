import { writable } from "svelte/store";
import { MachineStatus, type InventoryCategory } from "./types/models";

export const printFilter = writable<{ status?: MachineStatus | null, tier?: number | null }>({ status: MachineStatus.IDLE, tier: null });
export const invCategories = writable<InventoryCategory[]>([]);