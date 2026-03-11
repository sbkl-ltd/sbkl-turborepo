import { useCallback, useEffect, useRef, useState } from "react";

type SetStateFn<T> = (value: T | ((prevValue: T) => T)) => void;

interface UseControlledProps<T = unknown> {
	controlled: T | undefined;
	default: T | undefined;
	name: string;
	state?: string | undefined;
}

interface UseControllableStateParams<T> {
	prop?: T | undefined;
	defaultProp: T;
	onChange?: (state: T) => void;
	caller?: string;
}

const defaultStateName = "value";

const getDefaultComparisonKey = (value: unknown) => JSON.stringify(value);

function useControlled<T = unknown>({
	controlled,
	default: defaultProp,
	name,
	state = defaultStateName,
}: UseControlledProps<T>): [T, SetStateFn<T>] {
	const { current: isControlled } = useRef(controlled !== undefined);
	const [valueState, setValue] = useState<T>(defaultProp as T);
	const value = (isControlled ? controlled : valueState) as T;
	const { current: defaultValue } = useRef(defaultProp);

	useEffect(() => {
		if (process.env.NODE_ENV === "production") {
			return;
		}

		if (isControlled !== (controlled !== undefined)) {
			console.error(
				[
					`Base UI: A component is changing the ${isControlled ? "" : "un"}controlled ${state} state of ${name} to be ${isControlled ? "un" : ""}controlled.`,
					"Elements should not switch from uncontrolled to controlled (or vice versa).",
					`Decide between using a controlled or uncontrolled ${name} element for the lifetime of the component.`,
					"The nature of the state is determined during the first render. It's considered controlled if the value is not `undefined`.",
					"More info: https://fb.me/react-controlled-components",
				].join("\n"),
			);
		}
	}, [state, name, controlled]);

	useEffect(() => {
		if (process.env.NODE_ENV === "production") {
			return;
		}

		if (
			!isControlled &&
			getDefaultComparisonKey(defaultValue) !==
				getDefaultComparisonKey(defaultProp)
		) {
			console.error(
				[
					`Base UI: A component is changing the default ${state} state of an uncontrolled ${name} after being initialized. To suppress this warning opt to use a controlled ${name}.`,
				].join("\n"),
			);
		}
	}, [defaultProp, name, state]);

	const setValueIfUncontrolled = useCallback<SetStateFn<T>>((newValue) => {
		if (!isControlled) {
			setValue(newValue);
		}
	}, []);

	return [value, setValueIfUncontrolled];
}

export function useControllableState<T>({
	prop,
	defaultProp,
	onChange,
	caller,
}: UseControllableStateParams<T>): [T, SetStateFn<T>] {
	const isControlled = prop !== undefined;
	const [value, setUncontrolledValue] = useControlled<T>({
		controlled: prop,
		default: defaultProp,
		name: caller ?? "useControllableState",
		state: "value",
	});
	const previousUncontrolledValueRef = useRef(value);

	useEffect(() => {
		if (
			!isControlled &&
			!Object.is(previousUncontrolledValueRef.current, value)
		) {
			onChange?.(value);
			previousUncontrolledValueRef.current = value;
		}
	}, [isControlled, onChange, value]);

	const setValue = useCallback<SetStateFn<T>>(
		(nextValue) => {
			if (isControlled) {
				const resolvedValue =
					typeof nextValue === "function"
						? (nextValue as (prevValue: T) => T)(value)
						: nextValue;

				if (!Object.is(resolvedValue, value)) {
					onChange?.(resolvedValue);
				}
				return;
			}

			setUncontrolledValue(nextValue);
		},
		[isControlled, onChange, setUncontrolledValue, value],
	);

	return [value, setValue];
}
