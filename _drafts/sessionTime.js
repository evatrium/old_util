import {CreateLocalStore, getCurrentRoundedTimeMs, oncePerSecond} from "../src/allUtils";

const ONE_HOUR_SEC = 3600;
const FIVE_MIN_MS = 1000 * 60 * 5;


export const SessionTimeDialogControl = (
    {
        onExtendRequestFn,
        onStopFn,
        checkIsLoggedInFn,
        storageKey = 'SESSION_TIME_DIALOG_CONTROL',
        durationDialogOpenMs = FIVE_MIN_MS,
        sessionDurationSeconds = ONE_HOUR_SEC,
        openDialogFn,
        closeDialogFn,
        onTimeTick,
    } = {}) => {

    const store = CreateLocalStore({namespace: storageKey});
    const {setItemDebounced, subscribe, getItem, removeItem} = store;

    let dialogOpen = false,
        lastRefreshMs = undefined,
        clearTimer = () => undefined,
        unlisten = () => undefined,
        onTick = onTimeTick, setOnTick = fn => (onTick = fn);

    const updateCountdownSeconds = durationSeconds => {
        sessionDurationSeconds = durationSeconds || sessionDurationSeconds;
        lastRefreshMs = getCurrentRoundedTimeMs();
        setItemDebounced(lastRefreshMs);
    };

    const stop = ({logout = true} = {}) => {
        clearTimer();
        unlisten();
        removeItem();
        logout && onStopFn && onStopFn();
    };

    const start = (durationSeconds) => {
        clearTimer();
        unlisten();
        unlisten = subscribe(onStorageChange)
        dialogOpen && closeDialogFn && closeDialogFn();
        updateCountdownSeconds(durationSeconds);

        clearTimer = oncePerSecond(nowMs => {
            let durationMs = sessionDurationSeconds * 1000,
                futureExpirationDateMs = lastRefreshMs + durationMs,
                logoutMsFromNow = futureExpirationDateMs - nowMs,
                openDialogMsFromNow = logoutMsFromNow - durationDialogOpenMs,
                isLoggedInLocally = checkIsLoggedInFn && checkIsLoggedInFn(),

                shouldOpenDialog = !dialogOpen && isLoggedInLocally && openDialogMsFromNow <= 0,
                shouldStopSession = isLoggedInLocally && logoutMsFromNow <= 0;

            onTick && onTick({logoutMsFromNow});
            if (shouldOpenDialog && openDialogFn) openDialogFn();
            if (shouldStopSession) stop();
        });
    }

    const extend = async () => {
        clearTimer();
        try {
            await onExtendRequestFn();
            start();
        } catch (e) {
            stop();
            return e;
        }
    }

    const onStorageChange = () => {
        const updatedTime = getItem() || 0;
        if ((updatedTime >= lastRefreshMs) && dialogOpen && closeDialogFn) closeDialogFn();
        lastRefreshMs = updatedTime;
    }

    return {
        start,
        stop,
        extend,
        setOnTick,
        updateCountdownSeconds
    }
}