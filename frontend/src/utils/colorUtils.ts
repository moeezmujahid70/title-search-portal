const generateColorFromString = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    const hue = Math.abs(hash) % 360;
    return {
        background: `hsla(${hue}, 70%, 50%, 0.2)`,
        color: `hsl(${hue}, 70%, 45%)`,
        border: `1px solid hsla(${hue}, 70%, 50%, 0.3)`
    };
};

export { generateColorFromString };