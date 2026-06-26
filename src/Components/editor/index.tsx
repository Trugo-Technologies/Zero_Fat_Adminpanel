import { Color } from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import TextStyle from "@tiptap/extension-text-style";
import { EditorProvider, useCurrentEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Box, Divider, IconButton } from "@mui/material";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatStrikethroughIcon from "@mui/icons-material/FormatStrikethrough";
import FormatClearIcon from "@mui/icons-material/FormatClear";
import LocalParkingIcon from "@mui/icons-material/LocalParking";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import HorizontalRuleIcon from "@mui/icons-material/HorizontalRule";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
import FormatColorTextIcon from "@mui/icons-material/FormatColorText";
import { MouseEventHandler } from "react";
import TextAlign from "@tiptap/extension-text-align";
const IconButtonWithActive = ({
  icon,
  isActive,
  onClick,
  disabled,
}: {
  icon: React.ReactNode;
  isActive: boolean;
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement> | undefined;
}) => (
  <IconButton
    disabled={disabled}
    onClick={onClick}
    sx={{
      borderRadius: "4px",
      bgcolor: isActive ? "grey.300" : "transparent",
      width: "45px",
      height: "45px",
      mx: 0.3,
    }}
  >
    {icon}
  </IconButton>
);
const CustomDivider = () => (
  <Divider
    orientation="vertical"
    flexItem
    variant="middle"
    sx={{ borderColor: "grey.500" }}
  />
);
const MenuBar = () => {
  const { editor } = useCurrentEditor();

  if (!editor) {
    return null;
  }

  return (
    <Box
      sx={{
        border: (theme) => `1px solid ${theme.palette.grey[100]}`,
        p: 1,
        bgcolor: "grey.50",
        borderRadius: "8px 8px 0 0 ",
      }}
    >
      <Box
        sx={{
          // border: (theme) => `1px solid ${theme.palette.grey[100]}`,
          display: "flex",
          borderRadius: "8px",
          color: "text.secondary",
          "& svg": {
            m: 0.5,
          },
        }}
      >
        <IconButtonWithActive
          onClick={() => editor.chain().focus().toggleBold().run()}
          icon={<FormatBoldIcon />}
          isActive={editor.isActive("bold")}
        />
        {/* <CustomDivider /> */}
        <IconButtonWithActive
          onClick={() => editor.chain().focus().toggleItalic().run()}
          icon={<FormatItalicIcon />}
          isActive={editor.isActive("italic")}
        />
        {/* <CustomDivider /> */}
        <IconButtonWithActive
          onClick={() => editor.chain().focus().toggleStrike().run()}
          icon={<FormatStrikethroughIcon />}
          isActive={editor.isActive("strike")}
        />
        {/* <CustomDivider /> */}
        <IconButtonWithActive
          onClick={() => editor.chain().focus().unsetAllMarks().run()}
          icon={<FormatClearIcon />}
          isActive={false}
        />
        <CustomDivider />
        <IconButtonWithActive
          onClick={() => editor.chain().focus().setParagraph().run()}
          icon={<LocalParkingIcon />}
          isActive={editor.isActive("paragraph")}
        />
        <IconButtonWithActive
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          icon={<div>H1</div>}
          isActive={editor.isActive("heading", { level: 1 })}
        />
        <IconButtonWithActive
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          icon={<div>H2</div>}
          isActive={editor.isActive("heading", { level: 2 })}
        />
        <IconButtonWithActive
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          icon={<div>H3</div>}
          isActive={editor.isActive("heading", { level: 3 })}
        />
        <IconButtonWithActive
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 4 }).run()
          }
          icon={<div>H4</div>}
          isActive={editor.isActive("heading", { level: 4 })}
        />
        <IconButtonWithActive
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 5 }).run()
          }
          icon={<div>H5</div>}
          isActive={editor.isActive("heading", { level: 5 })}
        />
        <CustomDivider />
        <IconButtonWithActive
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          icon={<FormatListBulletedIcon />}
          isActive={editor.isActive("bulletList")}
        />
        <IconButtonWithActive
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          icon={<FormatListNumberedIcon />}
          isActive={editor.isActive("orderedList")}
        />

        <CustomDivider />
        <IconButtonWithActive
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          icon={<FormatAlignLeftIcon />}
          isActive={false}
        />
        <IconButtonWithActive
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          icon={<FormatAlignCenterIcon />}
          isActive={false}
          // disabled={!editor.chain().focus().setTextAlign("center").run()}
        />
        <CustomDivider />
        <IconButtonWithActive
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          icon={<HorizontalRuleIcon />}
          isActive={editor.isActive("orderedList")}
        />
        <IconButtonWithActive
          onClick={() => editor.chain().focus().setColor("red").run()}
          icon={<FormatColorTextIcon color="error" />}
          isActive={editor.isActive("textStyle", { color: "red" })}
        />
        <IconButtonWithActive
          onClick={() => editor.chain().focus().setColor("black").run()}
          icon={<FormatColorTextIcon color="inherit" />}
          isActive={editor.isActive("textStyle", { color: "black" })}
        />
        <CustomDivider />
        <IconButtonWithActive
          onClick={() => editor.chain().focus().undo().run()}
          icon={<UndoIcon />}
          isActive={false}
          disabled={!editor.can().chain().focus().undo().run()}
        />
        <IconButtonWithActive
          onClick={() => editor.chain().focus().redo().run()}
          icon={<RedoIcon />}
          isActive={false}
          disabled={!editor.can().chain().focus().redo().run()}
        />
      </Box>
    </Box>
  );
};

const extensions = [
  Color.configure({ types: [TextStyle.name, ListItem.name] }),
  // https://tiptap.dev/docs/editor/examples/default
  // @ts-ignore // this issue from library itself and the attribute set from documentation
  TextStyle.configure({ types: [ListItem.name] }),
  TextAlign.configure({
    alignments: ["left", "center", "right", "justify"],
    types: ["heading", "paragraph"],
  }),
  StarterKit.configure({
    bulletList: {
      keepMarks: true,
      keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
    },
    orderedList: {
      keepMarks: true,
      keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
    },
  }),
];

function ContentEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <Box
      sx={{
        "& .tiptap": {
          outline: "none",

          border: (theme) => `1px solid ${theme.palette.grey?.[100]}`,
          p: 1,
          px: 2,
          py: 4,
          borderRadius: "0 0 8px 8px",
        },
      }}
    >
      <EditorProvider
        slotBefore={<MenuBar />}
        extensions={extensions}
        content={value}
        onUpdate={(editor) => {
          onChange(editor.editor?.getHTML());
        }}
      ></EditorProvider>
    </Box>
  );
}

export default ContentEditor;
