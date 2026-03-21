import os

base = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "src", "components", "ui")

def process_file(filename, replacements, add_react_import=False):
    filepath = os.path.join(base, filename)
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    for old, new in replacements:
        if old in content:
            content = content.replace(old, new, 1)
        else:
            print(f"WARNING: Pattern not found in {filename}: {repr(old[:80])}...")

    if add_react_import and 'import * as React from "react"' not in content:
        if '"use client"' in content:
            content = content.replace('"use client"\n', '"use client"\n\nimport * as React from "react"\n', 1)
        else:
            content = 'import * as React from "react"\n\n' + content

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"OK: {filename}")

# avatar.tsx (6 functions)
process_file("avatar.tsx", [
    ('size?: "default" | "sm" | "lg"\n}) {',
     'size?: "default" | "sm" | "lg"\n}): React.JSX.Element {'),
    ('}: AvatarPrimitive.Image.Props) {',
     '}: AvatarPrimitive.Image.Props): React.JSX.Element {'),
    ('}: AvatarPrimitive.Fallback.Props) {',
     '}: AvatarPrimitive.Fallback.Props): React.JSX.Element {'),
    ('}: React.ComponentProps<"span">) {',
     '}: React.ComponentProps<"span">): React.JSX.Element {'),
    ('function AvatarGroup({ className, ...props }: React.ComponentProps<"div">) {',
     'function AvatarGroup({ className, ...props }: React.ComponentProps<"div">): React.JSX.Element {'),
    ('}: React.ComponentProps<"div">) {\n  return (\n    <div\n      data-slot="avatar-group-count"',
     '}: React.ComponentProps<"div">): React.JSX.Element {\n  return (\n    <div\n      data-slot="avatar-group-count"'),
])

# badge.tsx
process_file("badge.tsx", [
    ('}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {',
     '}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>): React.ReactElement {'),
], add_react_import=True)

# button.tsx
process_file("button.tsx", [
    ('}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {',
     '}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>): React.JSX.Element {'),
], add_react_import=True)

# card.tsx (7 functions)
process_file("card.tsx", [
    ('}: React.ComponentProps<"div"> & { size?: "default" | "sm" }) {',
     '}: React.ComponentProps<"div"> & { size?: "default" | "sm" }): React.JSX.Element {'),
    ('function CardHeader({ className, ...props }: React.ComponentProps<"div">) {',
     'function CardHeader({ className, ...props }: React.ComponentProps<"div">): React.JSX.Element {'),
    ('function CardTitle({ className, ...props }: React.ComponentProps<"div">) {',
     'function CardTitle({ className, ...props }: React.ComponentProps<"div">): React.JSX.Element {'),
    ('function CardDescription({ className, ...props }: React.ComponentProps<"div">) {',
     'function CardDescription({ className, ...props }: React.ComponentProps<"div">): React.JSX.Element {'),
    ('function CardAction({ className, ...props }: React.ComponentProps<"div">) {',
     'function CardAction({ className, ...props }: React.ComponentProps<"div">): React.JSX.Element {'),
    ('function CardContent({ className, ...props }: React.ComponentProps<"div">) {',
     'function CardContent({ className, ...props }: React.ComponentProps<"div">): React.JSX.Element {'),
    ('function CardFooter({ className, ...props }: React.ComponentProps<"div">) {',
     'function CardFooter({ className, ...props }: React.ComponentProps<"div">): React.JSX.Element {'),
])

# dialog.tsx (10 functions)
process_file("dialog.tsx", [
    ('function Dialog({ ...props }: DialogPrimitive.Root.Props) {',
     'function Dialog({ ...props }: DialogPrimitive.Root.Props): React.JSX.Element {'),
    ('function DialogTrigger({ ...props }: DialogPrimitive.Trigger.Props) {',
     'function DialogTrigger({ ...props }: DialogPrimitive.Trigger.Props): React.JSX.Element {'),
    ('function DialogPortal({ ...props }: DialogPrimitive.Portal.Props) {',
     'function DialogPortal({ ...props }: DialogPrimitive.Portal.Props): React.JSX.Element {'),
    ('function DialogClose({ ...props }: DialogPrimitive.Close.Props) {',
     'function DialogClose({ ...props }: DialogPrimitive.Close.Props): React.JSX.Element {'),
    ('}: DialogPrimitive.Backdrop.Props) {',
     '}: DialogPrimitive.Backdrop.Props): React.JSX.Element {'),
    ('  showCloseButton?: boolean\n}) {\n  return (\n    <DialogPortal>',
     '  showCloseButton?: boolean\n}): React.JSX.Element {\n  return (\n    <DialogPortal>'),
    ('function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {',
     'function DialogHeader({ className, ...props }: React.ComponentProps<"div">): React.JSX.Element {'),
    ('  showCloseButton?: boolean\n}) {\n  return (\n    <div\n      data-slot="dialog-footer"',
     '  showCloseButton?: boolean\n}): React.JSX.Element {\n  return (\n    <div\n      data-slot="dialog-footer"'),
    ('function DialogTitle({ className, ...props }: DialogPrimitive.Title.Props) {',
     'function DialogTitle({ className, ...props }: DialogPrimitive.Title.Props): React.JSX.Element {'),
    ('}: DialogPrimitive.Description.Props) {',
     '}: DialogPrimitive.Description.Props): React.JSX.Element {'),
])

# dropdown-menu.tsx (15 functions)
process_file("dropdown-menu.tsx", [
    ('function DropdownMenu({ ...props }: MenuPrimitive.Root.Props) {',
     'function DropdownMenu({ ...props }: MenuPrimitive.Root.Props): React.JSX.Element {'),
    ('function DropdownMenuPortal({ ...props }: MenuPrimitive.Portal.Props) {',
     'function DropdownMenuPortal({ ...props }: MenuPrimitive.Portal.Props): React.JSX.Element {'),
    ('function DropdownMenuTrigger({ ...props }: MenuPrimitive.Trigger.Props) {',
     'function DropdownMenuTrigger({ ...props }: MenuPrimitive.Trigger.Props): React.JSX.Element {'),
    ('    "align" | "alignOffset" | "side" | "sideOffset"\n  >) {',
     '    "align" | "alignOffset" | "side" | "sideOffset"\n  >): React.JSX.Element {'),
    ('function DropdownMenuGroup({ ...props }: MenuPrimitive.Group.Props) {',
     'function DropdownMenuGroup({ ...props }: MenuPrimitive.Group.Props): React.JSX.Element {'),
    ('}: MenuPrimitive.GroupLabel.Props & {\n  inset?: boolean\n}) {',
     '}: MenuPrimitive.GroupLabel.Props & {\n  inset?: boolean\n}): React.JSX.Element {'),
    ('  variant?: "default" | "destructive"\n}) {',
     '  variant?: "default" | "destructive"\n}): React.JSX.Element {'),
    ('function DropdownMenuSub({ ...props }: MenuPrimitive.SubmenuRoot.Props) {',
     'function DropdownMenuSub({ ...props }: MenuPrimitive.SubmenuRoot.Props): React.JSX.Element {'),
    ('}: MenuPrimitive.SubmenuTrigger.Props & {\n  inset?: boolean\n}) {',
     '}: MenuPrimitive.SubmenuTrigger.Props & {\n  inset?: boolean\n}): React.JSX.Element {'),
    ('}: React.ComponentProps<typeof DropdownMenuContent>) {',
     '}: React.ComponentProps<typeof DropdownMenuContent>): React.JSX.Element {'),
    ('}: MenuPrimitive.CheckboxItem.Props & {\n  inset?: boolean\n}) {',
     '}: MenuPrimitive.CheckboxItem.Props & {\n  inset?: boolean\n}): React.JSX.Element {'),
    ('function DropdownMenuRadioGroup({ ...props }: MenuPrimitive.RadioGroup.Props) {',
     'function DropdownMenuRadioGroup({ ...props }: MenuPrimitive.RadioGroup.Props): React.JSX.Element {'),
    ('}: MenuPrimitive.RadioItem.Props & {\n  inset?: boolean\n}) {',
     '}: MenuPrimitive.RadioItem.Props & {\n  inset?: boolean\n}): React.JSX.Element {'),
    ('}: MenuPrimitive.Separator.Props) {',
     '}: MenuPrimitive.Separator.Props): React.JSX.Element {'),
    ('}: React.ComponentProps<"span">) {',
     '}: React.ComponentProps<"span">): React.JSX.Element {'),
])

# input.tsx
process_file("input.tsx", [
    ('function Input({ className, type, ...props }: React.ComponentProps<"input">) {',
     'function Input({ className, type, ...props }: React.ComponentProps<"input">): React.JSX.Element {'),
])

# label.tsx
process_file("label.tsx", [
    ('function Label({ className, ...props }: React.ComponentProps<"label">) {',
     'function Label({ className, ...props }: React.ComponentProps<"label">): React.JSX.Element {'),
])

# select.tsx (9 functions)
process_file("select.tsx", [
    ('function SelectGroup({ className, ...props }: SelectPrimitive.Group.Props) {',
     'function SelectGroup({ className, ...props }: SelectPrimitive.Group.Props): React.JSX.Element {'),
    ('function SelectValue({ className, ...props }: SelectPrimitive.Value.Props) {',
     'function SelectValue({ className, ...props }: SelectPrimitive.Value.Props): React.JSX.Element {'),
    ('  size?: "sm" | "default"\n}) {',
     '  size?: "sm" | "default"\n}): React.JSX.Element {'),
    ('    "align" | "alignOffset" | "side" | "sideOffset" | "alignItemWithTrigger"\n  >) {',
     '    "align" | "alignOffset" | "side" | "sideOffset" | "alignItemWithTrigger"\n  >): React.JSX.Element {'),
    ('}: SelectPrimitive.GroupLabel.Props) {',
     '}: SelectPrimitive.GroupLabel.Props): React.JSX.Element {'),
    ('}: SelectPrimitive.Item.Props) {',
     '}: SelectPrimitive.Item.Props): React.JSX.Element {'),
    ('}: SelectPrimitive.Separator.Props) {',
     '}: SelectPrimitive.Separator.Props): React.JSX.Element {'),
    ('}: React.ComponentProps<typeof SelectPrimitive.ScrollUpArrow>) {',
     '}: React.ComponentProps<typeof SelectPrimitive.ScrollUpArrow>): React.JSX.Element {'),
    ('}: React.ComponentProps<typeof SelectPrimitive.ScrollDownArrow>) {',
     '}: React.ComponentProps<typeof SelectPrimitive.ScrollDownArrow>): React.JSX.Element {'),
])

# separator.tsx
process_file("separator.tsx", [
    ('}: SeparatorPrimitive.Props) {',
     '}: SeparatorPrimitive.Props): React.JSX.Element {'),
], add_react_import=True)

# skeleton.tsx
process_file("skeleton.tsx", [
    ('function Skeleton({ className, ...props }: React.ComponentProps<"div">) {',
     'function Skeleton({ className, ...props }: React.ComponentProps<"div">): React.JSX.Element {'),
], add_react_import=True)

# sonner.tsx
process_file("sonner.tsx", [
    ('const Toaster = ({ ...props }: ToasterProps) => {',
     'const Toaster = ({ ...props }: ToasterProps): React.JSX.Element => {'),
], add_react_import=True)

# tabs.tsx (4 functions)
process_file("tabs.tsx", [
    ('}: TabsPrimitive.Root.Props) {',
     '}: TabsPrimitive.Root.Props): React.JSX.Element {'),
    ('}: TabsPrimitive.List.Props & VariantProps<typeof tabsListVariants>) {',
     '}: TabsPrimitive.List.Props & VariantProps<typeof tabsListVariants>): React.JSX.Element {'),
    ('function TabsTrigger({ className, ...props }: TabsPrimitive.Tab.Props) {',
     'function TabsTrigger({ className, ...props }: TabsPrimitive.Tab.Props): React.JSX.Element {'),
    ('function TabsContent({ className, ...props }: TabsPrimitive.Panel.Props) {',
     'function TabsContent({ className, ...props }: TabsPrimitive.Panel.Props): React.JSX.Element {'),
], add_react_import=True)

# textarea.tsx
process_file("textarea.tsx", [
    ('function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {',
     'function Textarea({ className, ...props }: React.ComponentProps<"textarea">): React.JSX.Element {'),
])

print("\nAll files processed!")
