const parseFraction = (frac : string) => {
    if(frac == 'full'){
        return 1;
    }
    if(frac == '0'){
        return 0
    }
    const parts = frac.split('/');
    const numer = parseFloat(parts[0]);
    const demon = parseFloat(parts[1]);
    return numer / demon;
}

export const closetTailWindSize = (width : number) => {
    const TailWindSizes: string[] = [
        '0',
        '1/2',
        '1/3',
        '2/3',
        '1/4',
        '2/4',
        '3/4',
        '1/5',
        '2/5',
        '3/5',
        '4/5',
        '1/6',
        '2/6',
        '3/6',
        '4/6',
        '5/6',
        '1/12',
        '2/12',
        '3/12',
        '4/12',
        '5/12',
        '6/12',
        '7/12',
        '8/12',
        '9/12',
        '10/12',
        '11/12',
        'full'
    ]

    let currMin : string = TailWindSizes[0];
    let minDiff : number = Math.abs(parseFraction(TailWindSizes[0]) - width);
    for(let i in TailWindSizes){
        if(Math.abs(parseFraction(TailWindSizes[i]) - width) < minDiff){
            currMin = TailWindSizes[i];
            minDiff = Math.abs(parseFraction(TailWindSizes[i]) - width);
        
        }
    }
    return parseFraction(currMin);
}