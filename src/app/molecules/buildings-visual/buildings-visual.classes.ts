const base: string = 'buildings-visual';
const baseContainer: string = `${base}__container`;
const horizonHouseGroup: string = `${baseContainer}__horizon-house-g`;

export const BuildingsVisualClasses = {
    base,
    baseContainer,
    horizonHouseGroup,
    horizonHouseBase: `${horizonHouseGroup}__base`,
    horizonHouseRoof: `${horizonHouseGroup}__roof`,
    horizonHouseChimney: `${horizonHouseGroup}__chimney`,
    horizonHouseWindow: `${horizonHouseGroup}__window`,
    horizonHouseWindowLightsOn: `${horizonHouseGroup}__window--lights-on`,
    horizonHouseGroupInteract: `${horizonHouseGroup}__interact`,
};
