export const getUnixTimeStampNow = () => Math.round(+new Date() / 1000);

export const formatSeconds = seconds =>
    Object.entries({hr: seconds / 3600, min: (seconds % 3600) / 60, sec: (seconds % 3600) % 60})
        .reduce((acc, [t, a, amount = Math.floor(a)]) => {
            amount = amount ? amount + `${t} ` : '';
            acc = acc + amount;
            return acc;
        }, '');