import * as React from "react";
import {
  AnyFieldMeta,
  createFormHook,
  createFormHookContexts,
} from "@tanstack/react-form";
import { ZodError } from "zod";

import { cn } from "@sbkl-turborepo/ui/lib/utils";

import { Input } from "@sbkl-turborepo/ui/components/input";
import { Textarea } from "@sbkl-turborepo/ui/components/textarea";
import { Checkbox } from "@sbkl-turborepo/ui/components/checkbox";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@sbkl-turborepo/ui/components/select";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldSet,
} from "@sbkl-turborepo/ui/components/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@sbkl-turborepo/ui/components/input-group";
import {
  RadioGroup,
  RadioGroupItem,
} from "@sbkl-turborepo/ui/components/radio-group";
import {
  ButtonGroup,
  ButtonGroupText,
} from "@sbkl-turborepo/ui/components/button-group";
import { Switch } from "@sbkl-turborepo/ui/components/switch";
import { ScrollArea } from "@sbkl-turborepo/ui/components/scroll-area";
import { Camera, LucideIcon } from "lucide-react";

export const { fieldContext, useFieldContext, formContext, useFormContext } =
  createFormHookContexts();

interface ErrorFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  meta: AnyFieldMeta;
}

export function ErrorsField({ meta, className, ...props }: ErrorFieldProps) {
  if (!meta.errors.length) return null;
  return (
    <div className={cn(className)} {...props}>
      {meta.errors.map((e: ZodError | string, index) => {
        return (
          <p key={index.toString()} className="mb-1 text-xs text-destructive">
            {typeof e === "string" ? e : e.message}
          </p>
        );
      })}
    </div>
  );
}

interface TextFieldProps extends React.ComponentProps<typeof Input> {
  label?: string;
  loading?: boolean;
  fieldClassName?: string;
  inputGroupClassName?: string;
  description?: string;
  icon?: LucideIcon;
  addonRight?: React.ReactNode;
}

export function TextField({
  label,
  loading = false,
  fieldClassName,
  inputGroupClassName,
  description,
  icon: Icon,
  addonRight,
  ...props
}: TextFieldProps) {
  const field = useFieldContext<string>();
  const hasErrors = field.state.meta.errors.length > 0;

  return (
    <Field
      data-invalid={hasErrors ? true : undefined}
      className={cn("w-full", fieldClassName)}
    >
      {label ? <FieldLabel htmlFor={field.name}>{label}</FieldLabel> : null}
      <InputGroup className={cn(inputGroupClassName)}>
        <InputGroupInput
          {...props}
          id={field.name}
          name={field.name}
          value={field.state.value}
          onChange={(e) => field.handleChange(e.target.value)}
          aria-invalid={hasErrors ? true : undefined}
        />
        {Icon ? (
          <InputGroupAddon>
            <Icon />
          </InputGroupAddon>
        ) : null}
        {addonRight ? (
          <InputGroupAddon align="inline-end">{addonRight}</InputGroupAddon>
        ) : null}
      </InputGroup>
      {description ? <FieldDescription>{description}</FieldDescription> : null}
      {field.state.meta.errors.length > 0 ? (
        <FieldError errors={field.state.meta.errors} />
      ) : null}
    </Field>
  );
}

interface SplitTextFieldsProps {
  label?: string;
  loading?: boolean;
  fieldClassName?: string;
  inputGroupClassName?: string;
  description?: string;
  icons?: [LucideIcon | null, LucideIcon | null];
  disabled?: boolean;
  maxLength?: [number | null, number | null];
  size?:
    | {
        kind: "flex";
        values: [number, number];
      }
    | {
        kind: "width";
        values: [number | null, number | null];
      };
}

function SplitTextField({
  label,
  fieldClassName,
  inputGroupClassName,
  description,
  icons,
  disabled,
  size = {
    kind: "flex",
    values: [1, 1],
  },
  maxLength,
  ...props
}: SplitTextFieldsProps) {
  const field = useFieldContext<string>();
  const hasErrors = field.state.meta.errors.length > 0;

  const [LeftIcon, RightIcon] = icons ?? [null, null];

  const [leftValue = "", rightValue = ""] = (field.state.value ?? "").split(
    "-"
  );

  function handleChange(value: string, side: "left" | "right") {
    let newLeft = leftValue;
    let newRight = rightValue;

    const limitLeft = maxLength?.[0];
    const limitRight = maxLength?.[1];

    if (side === "left") {
      newLeft = value;
      if (typeof limitLeft === "number" && newLeft.length > limitLeft) {
        newLeft = newLeft.slice(0, limitLeft);
      }
    } else {
      newRight = value;
      if (typeof limitRight === "number" && newRight.length > limitRight) {
        newRight = newRight.slice(0, limitRight);
      }
    }

    field.handleChange(`${newLeft}-${newRight}`);
  }
  return (
    <Field
      data-invalid={hasErrors ? true : undefined}
      className={cn("w-full", fieldClassName)}
    >
      {label ? <FieldLabel htmlFor={field.name}>{label}</FieldLabel> : null}
      <div className="flex flex-row gap-0">
        <InputGroup
          className={cn(
            "rounded-r-none",
            {
              "shrink-0": size.kind === "width" && size.values[0] !== null,
            },
            inputGroupClassName
          )}
          style={
            size.kind === "flex"
              ? { flex: size.values[0] }
              : size.kind === "width"
              ? { width: size.values[0] ? size.values[0] : undefined }
              : undefined
          }
        >
          <InputGroupInput
            {...props}
            name={field.name}
            value={leftValue}
            onChange={(e) => handleChange(e.target.value, "left")}
            aria-invalid={hasErrors ? true : undefined}
            disabled={disabled}
          />
          {LeftIcon ? (
            <InputGroupAddon>
              <LeftIcon className="size-4 text-muted-foreground" />
            </InputGroupAddon>
          ) : null}
        </InputGroup>
        <InputGroup
          className={cn(
            "rounded-l-none border-l-0",
            {
              "shrink-0": size.kind === "width" && size.values[1] !== null,
            },
            inputGroupClassName
          )}
          style={
            size.kind === "flex"
              ? { flex: size.values[1] }
              : size.kind === "width"
              ? { width: size.values[1] ? `${size.values[1]}` : undefined }
              : undefined
          }
        >
          <InputGroupInput
            {...props}
            name={field.name}
            value={rightValue}
            onChange={(e) => handleChange(e.target.value, "right")}
            aria-invalid={hasErrors ? true : undefined}
            disabled={disabled}
          />
          {RightIcon ? (
            <InputGroupAddon>
              <RightIcon className="size-4 text-muted-foreground" />
            </InputGroupAddon>
          ) : null}
        </InputGroup>
      </div>
      {description ? <FieldDescription>{description}</FieldDescription> : null}
      {field.state.meta.errors.length > 0 ? (
        <FieldError errors={field.state.meta.errors} />
      ) : null}
    </Field>
  );
}

interface ButtonGroupTextFieldProps extends React.ComponentProps<typeof Input> {
  label?: string;
  loading?: boolean;
  fieldClassName?: string;
  description?: string;
  icon?: LucideIcon;
  addonRight?: React.ReactNode;
  prefix?: string;
  suffix?: string;
  forceLowerCase?: boolean;
}

export function ButtonGroupTextField({
  label,
  loading = false,
  fieldClassName,
  description,
  icon: Icon,
  addonRight,
  prefix,
  suffix,
  forceLowerCase,
  ...props
}: ButtonGroupTextFieldProps) {
  const field = useFieldContext<string>();
  const hasErrors = field.state.meta.errors.length > 0;

  return (
    <Field data-invalid={hasErrors} className={cn("w-full", fieldClassName)}>
      {label ? <FieldLabel htmlFor={field.name}>{label}</FieldLabel> : null}
      <ButtonGroup>
        {prefix ? <ButtonGroupText>{prefix}</ButtonGroupText> : null}
        <InputGroup>
          <InputGroupInput
            {...props}
            name={field.name}
            value={field.state.value}
            onChange={(e) =>
              forceLowerCase
                ? field.handleChange(e.target.value.toLowerCase())
                : field.handleChange(e.target.value)
            }
            aria-invalid={hasErrors}
          />
          {Icon ? (
            <InputGroupAddon>
              <Icon />
            </InputGroupAddon>
          ) : null}
          {addonRight ? (
            <InputGroupAddon align="inline-end">{addonRight}</InputGroupAddon>
          ) : null}
        </InputGroup>
        {suffix ? <ButtonGroupText>{suffix}</ButtonGroupText> : null}
      </ButtonGroup>
      {description ? <FieldDescription>{description}</FieldDescription> : null}
      <FieldError errors={field.state.meta.errors} />
    </Field>
  );
}

interface TextareaFieldProps extends React.ComponentProps<typeof Textarea> {
  label?: string;
  description?: string;
}

export function TextareaField({
  label,
  description,
  ...props
}: TextareaFieldProps) {
  const field = useFieldContext<string>();
  const hasErrors = field.state.meta.errors.length > 0;

  return (
    <Field data-invalid={hasErrors ? true : undefined} className="w-full">
      {label ? <FieldLabel htmlFor={field.name}>{label}</FieldLabel> : null}
      <Textarea
        {...props}
        id={field.name}
        name={field.name}
        aria-invalid={hasErrors ? true : undefined}
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
      />
      {description ? <FieldDescription>{description}</FieldDescription> : null}
      {hasErrors ? <FieldError errors={field.state.meta.errors} /> : null}
    </Field>
  );
}

interface SelectFieldProps
  extends Omit<React.ComponentProps<typeof Select>, "value" | "onValueChange"> {
  label?: string;
  placeholder?: string;
  description?: string;
  triggerClassName?: string;
  contentClassName?: string;
  children?: React.ReactNode;
}

export function SelectField({
  label,
  placeholder,
  description,
  triggerClassName,
  contentClassName,
  children,
  ...props
}: SelectFieldProps) {
  const field = useFieldContext<string>();
  const hasErrors = field.state.meta.errors.length > 0;

  return (
    <Field data-invalid={hasErrors ? true : undefined} className="w-full">
      {label ? <FieldLabel htmlFor={field.name}>{label}</FieldLabel> : null}
      <Select
        value={field.state.value ?? ""}
        onValueChange={field.handleChange}
        {...props}
      >
        <SelectTrigger id={field.name} className={triggerClassName}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className={contentClassName}>{children}</SelectContent>
      </Select>
      {description ? <FieldDescription>{description}</FieldDescription> : null}
      {hasErrors ? <FieldError errors={field.state.meta.errors} /> : null}
    </Field>
  );
}

interface CheckboxFieldProps extends React.ComponentProps<typeof Checkbox> {
  children?: React.ReactNode;
  containerClassName?: string;
}

export function CheckboxField({
  children,
  containerClassName,
  ...props
}: CheckboxFieldProps) {
  const field = useFieldContext<boolean>();

  return (
    <div className={cn("w-full", containerClassName)}>
      <div className="flex items-center space-x-2">
        <Checkbox
          id={field.name}
          {...props}
          checked={field.state.value}
          onCheckedChange={(state) => {
            if (state === "indeterminate") return;
            field.handleChange(state);
          }}
        />
        <label
          htmlFor={field.name}
          className="select-none text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {children}
        </label>
      </div>
      <ErrorsField className="mt-1.5 pl-3" meta={field.state.meta} />
    </div>
  );
}

interface RadioFieldProps extends React.ComponentProps<typeof RadioGroup> {
  label?: string;
  description?: string;
  options: {
    id: string;
    label: string;
    value: string;
    orientation?: "horizontal" | "vertical";
    image?: string | null;
    description?: string | null;
  }[];
}

export function RadioField({
  label,
  description,
  options,
  ...props
}: RadioFieldProps) {
  const field = useFieldContext<string>();
  const hasErrors = field.state.meta.errors.length > 0;
  return (
    <FieldSet data-invalid={hasErrors ? true : undefined}>
      {label ? <FieldLabel htmlFor={field.name}>{label}</FieldLabel> : null}
      {description ? <FieldDescription>{description}</FieldDescription> : null}
      <RadioGroup
        {...props}
        value={field.state.value}
        onValueChange={field.handleChange}
      >
        <ScrollArea
          orientation="horizontal"
          className="overflow-x-auto -ml-4 overflow-y-hidden -mt-2"
          viewportClassName=" pt-2 pb-4 px-4"
        >
          <div className="flex gap-2">
            {options.map((option) => {
              return (
                <Field
                  key={option.id}
                  orientation={option.orientation ?? "horizontal"}
                  className={cn(
                    "border rounded-md relative w-[250px] transition-colors duration-300",
                    field.state.value === option.value
                      ? "ring-3 ring-domain/40 border-domain"
                      : ""
                  )}
                >
                  <div className="flex flex-col gap-1 w-full h-full">
                    <FieldLabel
                      htmlFor={option.id}
                      className="font-normal flex flex-col p-4 w-full h-full"
                    >
                      {option.image ? (
                        <img
                          src={option.image}
                          alt={option.label}
                          className="w-10 h-10 rounded-md"
                          width={40}
                          height={40}
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center">
                          <Camera className="size-4 text-muted-foreground" />
                        </div>
                      )}
                      <span className="text-lg font-medium line-clamp-1">
                        {option.label}
                      </span>
                      {option.description ? (
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {option.description}
                        </p>
                      ) : null}
                    </FieldLabel>
                  </div>
                  <div className="absolute right-3 top-3">
                    <RadioGroupItem
                      className="ml-auto -mt-6"
                      value={option.value}
                      id={option.id}
                    />
                  </div>
                </Field>
              );
            })}
          </div>
        </ScrollArea>
      </RadioGroup>
      {hasErrors ? <FieldError errors={field.state.meta.errors} /> : null}
    </FieldSet>
  );
}

interface SwitchFieldProps extends React.ComponentProps<typeof Switch> {
  label?: string;
  description?: string;
}
export function SwitchField({
  label,
  description,
  ...props
}: SwitchFieldProps) {
  const field = useFieldContext<boolean>();
  const hasErrors = field.state.meta.errors.length > 0;
  return (
    <Field data-invalid={hasErrors ? true : undefined} orientation="horizontal">
      <FieldContent>
        <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
        <FieldDescription>{description}</FieldDescription>
      </FieldContent>
      <Switch
        id={field.name}
        {...props}
        checked={field.state.value}
        onCheckedChange={field.handleChange}
      />
      {hasErrors ? <FieldError errors={field.state.meta.errors} /> : null}
    </Field>
  );
}

export const { useAppForm, withForm } = createFormHook({
  fieldComponents: {
    TextField,
    TextareaField,
    SelectField,
    ButtonGroupTextField,
    CheckboxField,
    SplitTextField,
    RadioField,
    SwitchField,
  },
  formComponents: {
    // SubscribeButton,
  },
  fieldContext,
  formContext,
});
