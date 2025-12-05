// Generate class list: ปวช.1-3, ปวส.1-2, ห้อง 1-4
export const generateClassList = (): string[] => {
    const classes: string[] = [];

    // ปวช. 1-3
    for (let grade = 1; grade <= 3; grade++) {
        for (let room = 1; room <= 4; room++) {
            classes.push(`ปวช.${grade}/${room}`);
        }
    }

    // ปวส. 1-2
    for (let grade = 1; grade <= 2; grade++) {
        for (let room = 1; room <= 4; room++) {
            classes.push(`ปวส.${grade}/${room}`);
        }
    }

    return classes;
};

export const CLASS_LIST = generateClassList();
