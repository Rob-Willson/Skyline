const base: string = `sky-visual`;
const baseContainer: string = `${base}__container`;
const starsPositionGroup: string = `${baseContainer}__stars-position-g`;
const starsRotationGroup: string = `${starsPositionGroup}__stars-rotation-g`;
const horizonGlareGroup: string = `${baseContainer}__horizon-glare-g`;
const horizonLine: string = `${baseContainer}__horizon-line`;
const sunAndMoonGroup: string = `${baseContainer}__sun-and-moon-g`;
const moonGroup: string = `${sunAndMoonGroup}__moon-g`;

export const SkyVisualClasses = {
    base,
    baseContainer,
    starsPositionGroup,
    starsRotationGroup,
    starGroup: `${starsRotationGroup}__star-g`,
    starCircle: `${starsRotationGroup}__star-g__circle`,
    horizonGlareGroup,
    horizonGlareUpper: `${horizonGlareGroup}__upper`,
    horizonGlareLower: `${horizonGlareGroup}__lower`,
    horizonLine,
    sunAndMoonGroup,
    moonGroup,
    moonCircle: `${moonGroup}__circle`,
    moonText: `${moonGroup}__text`,
    moonTextHover: `${moonGroup}__text--hover`,
};
