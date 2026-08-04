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
import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";
import FormatColorTextIcon from "@mui/icons-material/FormatColorText";
import { MouseEventHandler } from "react";
import TextAlign from "@tiptap/extension-text-align";

const IconButtonWithActive = ({
  icon,
  isActive,
  onClick,
  disabled,
  title,
}: {
  icon: React.ReactNode;
  isActive: boolean;
  disabled?: boolean;
  title?: string;
  onClick?: MouseEventHandler<HTMLButtonElement> | undefined;
}) => (
  <IconButton
    disabled={disabled}
    onClick={onClick}
    title={title}
    size="small"
    sx={{
      borderRadius: 1,
      bgcolor: isActive ? "action.selected" : "transparent",
      width: 32,
      height: 32,
      color: isActive ? "primary.main" : "text.secondary",
      "&:hover": {
        bgcolor: isActive ? "action.selected" : "action.hover",
      },
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
    sx={{ borderColor: "divider", mx: 0.25 }}
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
        borderBottom: "1px solid",
        borderColor: "#E2E8F0",
        px: 1,
        py: 0.75,
        bgcolor: "#F8FAFC",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 0.25,
          color: "text.secondary",
          "& svg": {
            fontSize: 18,
          },
        }}
      >
        <IconButtonWithActive
          onClick={() => editor.chain().focus().toggleBold().run()}
          icon={<FormatBoldIcon fontSize="small" />}
          isActive={editor.isActive("bold")}
          title="Bold"
        />
        <IconButtonWithActive
          onClick={() => editor.chain().focus().toggleItalic().run()}
          icon={<FormatItalicIcon fontSize="small" />}
          isActive={editor.isActive("italic")}
          title="Italic"
        />
        <IconButtonWithActive
          onClick={() => editor.chain().focus().toggleStrike().run()}
          icon={<FormatStrikethroughIcon fontSize="small" />}
          isActive={editor.isActive("strike")}
          title="Strikethrough"
        />
        <IconButtonWithActive
          onClick={() => editor.chain().focus().unsetAllMarks().run()}
          icon={<FormatClearIcon fontSize="small" />}
          isActive={false}
          title="Clear formatting"
        />
        <CustomDivider />
        <IconButtonWithActive
          onClick={() => editor.chain().focus().setParagraph().run()}
          icon={<LocalParkingIcon fontSize="small" />}
          isActive={editor.isActive("paragraph")}
          title="Paragraph"
        />
        <IconButtonWithActive
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          icon={<Box sx={{ fontSize: 12, fontWeight: 700 }}>H1</Box>}
          isActive={editor.isActive("heading", { level: 1 })}
          title="Heading 1"
        />
        <IconButtonWithActive
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          icon={<Box sx={{ fontSize: 12, fontWeight: 700 }}>H2</Box>}
          isActive={editor.isActive("heading", { level: 2 })}
          title="Heading 2"
        />
        <IconButtonWithActive
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          icon={<Box sx={{ fontSize: 12, fontWeight: 700 }}>H3</Box>}
          isActive={editor.isActive("heading", { level: 3 })}
          title="Heading 3"
        />
        <CustomDivider />
        <IconButtonWithActive
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          icon={<FormatListBulletedIcon fontSize="small" />}
          isActive={editor.isActive("bulletList")}
          title="Bullet list"
        />
        <IconButtonWithActive
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          icon={<FormatListNumberedIcon fontSize="small" />}
          isActive={editor.isActive("orderedList")}
          title="Numbered list"
        />
        <CustomDivider />
        <IconButtonWithActive
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          icon={<FormatAlignLeftIcon fontSize="small" />}
          isActive={editor.isActive({ textAlign: "left" })}
          title="Align left"
        />
        <IconButtonWithActive
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          icon={<FormatAlignCenterIcon fontSize="small" />}
          isActive={editor.isActive({ textAlign: "center" })}
          title="Align center"
        />
        <IconButtonWithActive
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          icon={<FormatAlignRightIcon fontSize="small" />}
          isActive={editor.isActive({ textAlign: "right" })}
          title="Align right"
        />
        <CustomDivider />
        <IconButtonWithActive
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          icon={<HorizontalRuleIcon fontSize="small" />}
          isActive={false}
          title="Horizontal rule"
        />
        <IconButtonWithActive
          onClick={() => editor.chain().focus().setColor("#EF4444").run()}
          icon={<FormatColorTextIcon fontSize="small" sx={{ color: "#EF4444" }} />}
          isActive={editor.isActive("textStyle", { color: "#EF4444" })}
          title="Red text"
        />
        <IconButtonWithActive
          onClick={() => editor.chain().focus().setColor("#0F172A").run()}
          icon={<FormatColorTextIcon fontSize="small" />}
          isActive={editor.isActive("textStyle", { color: "#0F172A" })}
          title="Default text color"
        />
        <CustomDivider />
        <IconButtonWithActive
          onClick={() => editor.chain().focus().undo().run()}
          icon={<UndoIcon fontSize="small" />}
          isActive={false}
          disabled={!editor.can().chain().focus().undo().run()}
          title="Undo"
        />
        <IconButtonWithActive
          onClick={() => editor.chain().focus().redo().run()}
          icon={<RedoIcon fontSize="small" />}
          isActive={false}
          disabled={!editor.can().chain().focus().redo().run()}
          title="Redo"
        />
      </Box>
    </Box>
  );
};

const extensions = [
  Color.configure({ types: [TextStyle.name, ListItem.name] }),
  // @ts-ignore attribute config matches tiptap docs
  TextStyle.configure({ types: [ListItem.name] }),
  TextAlign.configure({
    alignments: ["left", "center", "right", "justify"],
    types: ["heading", "paragraph"],
  }),
  StarterKit.configure({
    bulletList: {
      keepMarks: true,
      keepAttributes: false,
    },
    orderedList: {
      keepMarks: true,
      keepAttributes: false,
    },
  }),
];

type ContentEditorProps = {
  value: string;
  onChange: (value: string) => void;
  minHeight?: number;
  placeholder?: string;
};

function ContentEditor({
  value,
  onChange,
  minHeight = 220,
  placeholder,
}: ContentEditorProps) {
  return (
    <Box
      sx={{
        border: "1px solid #E2E8F0",
        borderRadius: 2,
        overflow: "hidden",
        bgcolor: "#fff",
        transition: "border-color 0.2s ease, box-shadow 0.2s ease",
        "&:focus-within": {
          borderColor: "primary.main",
          boxShadow: (theme) => `0 0 0 3px ${theme.palette.primary.main}22`,
        },
        "& .tiptap": {
          outline: "none",
          minHeight,
          maxHeight: minHeight + 120,
          overflowY: "auto",
          px: 2,
          py: 1.75,
          fontSize: 14,
          lineHeight: 1.65,
          color: "#0F172A",
          "& p": {
            my: 0.75,
          },
          "& p:first-of-type": {
            mt: 0,
          },
          "& p:last-of-type": {
            mb: 0,
          },
          "& ul, & ol": {
            pl: 2.5,
            my: 1,
          },
          "& h1, & h2, & h3": {
            my: 1,
            lineHeight: 1.3,
          },
        },
      }}
    >
      <EditorProvider
        slotBefore={<MenuBar />}
        extensions={extensions}
        content={value}
        editorProps={{
          attributes: {
            "aria-label": placeholder || "Rich text editor",
          },
        }}
        onUpdate={(editor) => {
          onChange(editor.editor?.getHTML() ?? "");
        }}
      />
    </Box>
  );
}

export default ContentEditor;
