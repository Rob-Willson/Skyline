const base: string = `sky-visual`;
const baseContainer: string = `${base}__container`;
const starsGroup: string = `${baseContainer}__stars-g`;
const horizonGlareGroup: string = `${baseContainer}__horizon-glare-g`;
const horizonLine: string = `${baseContainer}__horizon-line`;
const sunAndMoonGroup: string = `${baseContainer}__sun-and-moon-g`;
const moonGroup: string = `${sunAndMoonGroup}__moon-g`;

export const SkyVisualClasses = {
    base,
    baseContainer,
    starsGroup,
    starGroup: `${starsGroup}__star-g`,
    starCircle: `${starsGroup}__star-g__circle`,
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
