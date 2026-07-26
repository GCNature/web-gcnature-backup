import React, { useEffect, useRef, useState } from "react";
import { 
  Bold, Italic, Underline, Link, Image, Video, Code, 
  AlignLeft, AlignCenter, AlignRight, List, ListOrdered, 
  Heading2, Heading3, Type, Strikethrough, Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImagePicker } from "./ImagePicker";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const FONT_SIZES = [
  { name: "12px", value: "12px" },
  { name: "14px", value: "14px" },
  { name: "16px (Mặc định)", value: "16px" },
  { name: "18px", value: "18px" },
  { name: "20px", value: "20px" },
  { name: "24px", value: "24px" },
  { name: "30px", value: "30px" },
  { name: "36px", value: "36px" },
];

const FONT_FAMILIES = [
  { name: "Mặc định (Sans-serif)", value: "sans-serif" },
  { name: "Serif (Có chân)", value: "serif" },
  { name: "Monospace (Mã máy)", value: "monospace" },
  { name: "Outfit (Hiện đại)", value: "'Outfit', sans-serif" },
  { name: "Playfair Display", value: "'Playfair Display', serif" },
  { name: "Inter (Thanh lịch)", value: "'Inter', sans-serif" },
];

export function RichTextEditor({ value, onChange, placeholder = "Nội dung bài viết..." }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const savedRangeRef = useRef<Range | null>(null);
  
  // States
  const [showSource, setShowSource] = useState(false);
  const [htmlValue, setHtmlValue] = useState(value || "");
  const [activeFormats, setActiveFormats] = useState<Record<string, boolean>>({});
  
  // Image/Video selection logic
  const [selectedEl, setSelectedEl] = useState<HTMLElement | null>(null);

  // Dialog state (Only image uses Dialog now)
  const [imgOpen, setImgOpen] = useState(false);
  const [imgUrl, setImgUrl] = useState("");

  // Sync editor content from external value
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || "<p><br></p>";
    }
    setHtmlValue(value || "");
  }, [value]);

  // Save current cursor selection range
  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      savedRangeRef.current = sel.getRangeAt(0);
    }
  };

  // Restore cursor selection range
  const restoreSelection = () => {
    if (savedRangeRef.current) {
      const sel = window.getSelection();
      if (sel) {
        sel.removeAllRanges();
        sel.addRange(savedRangeRef.current);
      }
    } else if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      onChange(html);
      setHtmlValue(html);
    }
  };

  // 1. For direct toolbar buttons (no focus loss, do not restore old selection range to avoid shift)
  const executeCommand = (command: string, val: string = "") => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
    document.execCommand(command, false, val);
    handleInput();
    saveSelection();
    updateActiveFormats();
  };

  // 2. For modals/prompts where focus was lost
  const executeCommandWithRestore = (command: string, val: string = "") => {
    restoreSelection();
    if (editorRef.current) {
      editorRef.current.focus();
    }
    document.execCommand(command, false, val);
    handleInput();
    saveSelection();
    updateActiveFormats();
  };

  // Check which formatting is active at cursor position
  const updateActiveFormats = () => {
    const formats: Record<string, boolean> = {
      bold: document.queryCommandState("bold"),
      italic: document.queryCommandState("italic"),
      underline: document.queryCommandState("underline"),
      strikeThrough: document.queryCommandState("strikeThrough"),
      justifyLeft: document.queryCommandState("justifyLeft"),
      justifyCenter: document.queryCommandState("justifyCenter"),
      justifyRight: document.queryCommandState("justifyRight"),
    };

    // Check block formats (H2, H3, P, UL, OL) by traversing parents
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      let node: Node | null = sel.getRangeAt(0).startContainer;
      while (node && node !== editorRef.current) {
        const tag = node.nodeName.toLowerCase();
        if (tag === "h2") formats.h2 = true;
        if (tag === "h3") formats.h3 = true;
        if (tag === "p") formats.p = true;
        if (tag === "ul") formats.ul = true;
        if (tag === "ol") formats.ol = true;
        node = node.parentNode;
      }
    }
    setActiveFormats(formats);
  };

  // Prompts bypass Radix UI dialog focus-stealing completely
  const handleLinkClick = () => {
    saveSelection();
    const url = prompt("Nhập đường dẫn liên kết (URL):", "https://");
    if (url && url.trim()) {
      restoreSelection();
      const sel = window.getSelection();
      if (sel && sel.isCollapsed) {
        const a = document.createElement("a");
        a.href = url.trim();
        a.innerText = url.trim();
        a.className = "text-[#5dc1d1] underline font-semibold hover:text-[#4bb4c4]";
        a.target = "_blank";
        
        if (savedRangeRef.current) {
          savedRangeRef.current.insertNode(a);
          savedRangeRef.current.setStartAfter(a);
          savedRangeRef.current.setEndAfter(a);
          sel.removeAllRanges();
          sel.addRange(savedRangeRef.current);
        }
      } else {
        document.execCommand("createLink", false, url.trim());
        const sel2 = window.getSelection();
        let node = sel2?.anchorNode;
        if (node) {
          if (node.nodeType === 3) node = node.parentNode;
          const parent = node as HTMLElement;
          if (parent && parent.nodeName === "A") {
            parent.className = "text-[#5dc1d1] underline font-semibold hover:text-[#4bb4c4]";
            parent.setAttribute("target", "_blank");
          }
        }
      }
      handleInput();
      updateActiveFormats();
    }
  };

  const handleYoutubeClick = () => {
    saveSelection();
    const url = prompt("Nhập liên kết video Youtube (VD: https://www.youtube.com/watch?v=...):");
    if (url && url.trim()) {
      const videoId = parseYoutubeId(url.trim());
      if (videoId) {
        const iframeHtml = `<div class="aspect-video my-4 max-w-full rounded-2xl overflow-hidden hover:ring-2 hover:ring-teal-400 cursor-pointer" style="width: 100%"><iframe src="https://www.youtube.com/embed/${videoId}" class="w-full h-full" frameborder="0" allowfullscreen></iframe></div><p><br></p>`;
        executeCommandWithRestore("insertHTML", iframeHtml);
      } else {
        alert("Đường dẫn Youtube không hợp lệ");
      }
    }
  };

  const handleImageSubmit = () => {
    if (imgUrl.trim()) {
      restoreSelection();
      if (editorRef.current) {
        editorRef.current.focus();
      }
      
      const img = document.createElement("img");
      img.src = imgUrl.trim();
      img.style.width = "100%";
      img.style.height = "auto";
      img.className = "rounded-2xl my-4 hover:ring-2 hover:ring-teal-400 cursor-pointer transition-all";
      
      const sel = window.getSelection();
      if (sel && savedRangeRef.current) {
        savedRangeRef.current.insertNode(img);
        
        // Insert empty paragraph after image to allow writing easily
        const p = document.createElement("p");
        p.innerHTML = "<br>";
        img.after(p);
        
        savedRangeRef.current.setStartAfter(p);
        savedRangeRef.current.setEndAfter(p);
        sel.removeAllRanges();
        sel.addRange(savedRangeRef.current);
      }
      
      handleInput();
      setImgUrl("");
      setImgOpen(false);
    }
  };

  const parseYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const applyStyleToSelection = (styleName: "fontSize" | "fontFamily", styleValue: string) => {
    restoreSelection();
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    const range = sel.getRangeAt(0);
    if (range.collapsed) return;

    if (styleName === "fontSize") {
      document.execCommand("fontSize", false, "7");
      if (editorRef.current) {
        const fontElements = editorRef.current.querySelectorAll("font[size='7']");
        fontElements.forEach((fontEl) => {
          const span = document.createElement("span");
          span.style.fontSize = styleValue;
          span.innerHTML = fontEl.innerHTML;
          fontEl.parentNode?.replaceChild(span, fontEl);
        });
      }
    } else if (styleName === "fontFamily") {
      const tempFontName = "TEMP_FONT_FAMILY_X";
      document.execCommand("fontName", false, tempFontName);
      if (editorRef.current) {
        const fontElements = editorRef.current.querySelectorAll(`font[face='${tempFontName}']`);
        fontElements.forEach((fontEl) => {
          const span = document.createElement("span");
          span.style.fontFamily = styleValue;
          span.innerHTML = fontEl.innerHTML;
          fontEl.parentNode?.replaceChild(span, fontEl);
        });
        const allElements = editorRef.current.getElementsByTagName("*");
        for (let i = 0; i < allElements.length; i++) {
          const el = allElements[i] as HTMLElement;
          if (el.style.fontFamily && el.style.fontFamily.includes(tempFontName)) {
            el.style.fontFamily = styleValue;
          }
        }
      }
    }

    handleInput();
    saveSelection();
    updateActiveFormats();
  };

  const handleSourceChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setHtmlValue(val);
    onChange(val);
    if (editorRef.current) {
      editorRef.current.innerHTML = val;
    }
  };

  // Image/Video inline styling controls
  const handleEditorClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const clickedMedia = target.closest("img, iframe, .aspect-video") as HTMLElement | null;
    
    if (clickedMedia) {
      setSelectedEl(clickedMedia);
    } else {
      setSelectedEl(null);
    }
    
    updateActiveFormats();
  };

  const resizeSelectedEl = (width: string) => {
    if (selectedEl) {
      selectedEl.style.width = width;
      selectedEl.style.height = "auto";
      handleInput();
    }
  };

  const alignSelectedEl = (align: "left" | "center" | "right") => {
    if (selectedEl) {
      if (align === "center") {
        selectedEl.style.display = "block";
        selectedEl.style.marginLeft = "auto";
        selectedEl.style.marginRight = "auto";
      } else if (align === "left") {
        selectedEl.style.display = "inline-block";
        selectedEl.style.marginLeft = "0";
        selectedEl.style.marginRight = "auto";
      } else if (align === "right") {
        selectedEl.style.display = "inline-block";
        selectedEl.style.marginLeft = "auto";
        selectedEl.style.marginRight = "0";
      }
      handleInput();
    }
  };

  const deleteSelectedEl = () => {
    if (selectedEl) {
      selectedEl.remove();
      setSelectedEl(null);
      handleInput();
    }
  };

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm focus-within:ring-2 focus-within:ring-teal-100 focus-within:border-teal-400 transition-all relative">
      
      {/* Media Edit Panel Overlay (WordPress-style visual controls for image/video) */}
      {selectedEl && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 z-30 bg-gray-900/95 backdrop-blur-sm text-white px-4 py-2 rounded-xl shadow-2xl flex items-center gap-3 text-xs border border-gray-800 animate-in fade-in zoom-in-95 duration-150">
          <span className="font-bold text-gray-400 border-r border-gray-700 pr-2 shrink-0">Bố cục ảnh / video:</span>
          
          {/* Sizes */}
          <div className="flex items-center gap-1">
            <button type="button" onClick={() => resizeSelectedEl("25%")} className="px-2 py-1 rounded bg-gray-800 hover:bg-teal-600 transition-colors">25%</button>
            <button type="button" onClick={() => resizeSelectedEl("50%")} className="px-2 py-1 rounded bg-gray-800 hover:bg-teal-600 transition-colors">50%</button>
            <button type="button" onClick={() => resizeSelectedEl("75%")} className="px-2 py-1 rounded bg-gray-800 hover:bg-teal-600 transition-colors">75%</button>
            <button type="button" onClick={() => resizeSelectedEl("100%")} className="px-2 py-1 rounded bg-gray-800 hover:bg-teal-600 transition-colors">100%</button>
          </div>

          <span className="w-px h-4 bg-gray-700 mx-1 shrink-0" />

          {/* Align */}
          <div className="flex items-center gap-1">
            <button type="button" onClick={() => alignSelectedEl("left")} className="p-1 rounded bg-gray-800 hover:bg-teal-600 transition-colors" title="Căn trái"><AlignLeft className="w-3.5 h-3.5" /></button>
            <button type="button" onClick={() => alignSelectedEl("center")} className="p-1 rounded bg-gray-800 hover:bg-teal-600 transition-colors" title="Căn giữa"><AlignCenter className="w-3.5 h-3.5" /></button>
            <button type="button" onClick={() => alignSelectedEl("right")} className="p-1 rounded bg-gray-800 hover:bg-teal-600 transition-colors" title="Căn phải"><AlignRight className="w-3.5 h-3.5" /></button>
          </div>

          <span className="w-px h-4 bg-gray-700 mx-1 shrink-0" />

          {/* Delete */}
          <button
            type="button"
            onClick={deleteSelectedEl}
            className="p-1 rounded bg-red-950/80 text-red-400 hover:bg-red-600 hover:text-white transition-colors"
            title="Xóa phần tử"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1.5 p-2 bg-gray-50 border-b border-gray-100 select-none">
        
        {/* Native Select elements bypass focus loss issues completely */}
        <select
          onChange={(e) => {
            if (e.target.value) {
              applyStyleToSelection("fontFamily", e.target.value);
              e.target.value = ""; // Reset dropdown value
            }
          }}
          className="h-8 rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs font-semibold text-gray-700 outline-none focus:ring-1 focus:ring-teal-200 transition-all shrink-0 cursor-pointer hover:border-gray-300"
        >
          <option value="">Font chữ</option>
          {FONT_FAMILIES.map(font => (
            <option key={font.value} value={font.value}>{font.name}</option>
          ))}
        </select>

        <select
          onChange={(e) => {
            if (e.target.value) {
              applyStyleToSelection("fontSize", e.target.value);
              e.target.value = ""; // Reset dropdown value
            }
          }}
          className="h-8 rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs font-semibold text-gray-700 outline-none focus:ring-1 focus:ring-teal-200 transition-all shrink-0 cursor-pointer hover:border-gray-300"
        >
          <option value="">Cỡ chữ</option>
          {FONT_SIZES.map(size => (
            <option key={size.value} value={size.value}>{size.name}</option>
          ))}
        </select>

        <span className="w-px h-6 bg-gray-200 mx-1 shrink-0" />

        {/* Text styling */}
        <Button
          type="button" variant="ghost" size="icon" className={`h-8 w-8 ${activeFormats.bold ? "bg-teal-100 text-teal-700 hover:bg-teal-200" : ""}`}
          onMouseDown={(e) => { e.preventDefault(); executeCommand("bold"); }} title="Chữ đậm"
        >
          <Bold className="w-4 h-4" />
        </Button>
        <Button
          type="button" variant="ghost" size="icon" className={`h-8 w-8 ${activeFormats.italic ? "bg-teal-100 text-teal-700 hover:bg-teal-200" : ""}`}
          onMouseDown={(e) => { e.preventDefault(); executeCommand("italic"); }} title="Chữ nghiêng"
        >
          <Italic className="w-4 h-4" />
        </Button>
        <Button
          type="button" variant="ghost" size="icon" className={`h-8 w-8 ${activeFormats.underline ? "bg-teal-100 text-teal-700 hover:bg-teal-200" : ""}`}
          onMouseDown={(e) => { e.preventDefault(); executeCommand("underline"); }} title="Gạch chân"
        >
          <Underline className="w-4 h-4" />
        </Button>
        <Button
          type="button" variant="ghost" size="icon" className={`h-8 w-8 ${activeFormats.strikeThrough ? "bg-teal-100 text-teal-700 hover:bg-teal-200" : ""}`}
          onMouseDown={(e) => { e.preventDefault(); executeCommand("strikeThrough"); }} title="Gạch ngang"
        >
          <Strikethrough className="w-4 h-4" />
        </Button>

        <span className="w-px h-6 bg-gray-200 mx-1 shrink-0" />

        {/* Headings */}
        <Button
          type="button" variant="ghost" size="icon" className={`h-8 w-8 ${activeFormats.h2 ? "bg-teal-100 text-teal-700 hover:bg-teal-200 font-extrabold" : ""}`}
          onMouseDown={(e) => { e.preventDefault(); executeCommand("formatBlock", "<h2>"); }} title="Tiêu đề lớn (H2)"
        >
          <Heading2 className="w-4 h-4" />
        </Button>
        <Button
          type="button" variant="ghost" size="icon" className={`h-8 w-8 ${activeFormats.h3 ? "bg-teal-100 text-teal-700 hover:bg-teal-200 font-extrabold" : ""}`}
          onMouseDown={(e) => { e.preventDefault(); executeCommand("formatBlock", "<h3>"); }} title="Tiêu đề phụ (H3)"
        >
          <Heading3 className="w-4 h-4" />
        </Button>
        <Button
          type="button" variant="ghost" size="icon" className={`h-8 w-8 ${activeFormats.p ? "bg-teal-100 text-teal-700 hover:bg-teal-200" : ""}`}
          onMouseDown={(e) => { e.preventDefault(); executeCommand("formatBlock", "<p>"); }} title="Đoạn văn (P)"
        >
          <Type className="w-4 h-4" />
        </Button>

        <span className="w-px h-6 bg-gray-200 mx-1 shrink-0" />

        {/* Lists */}
        <Button
          type="button" variant="ghost" size="icon" className={`h-8 w-8 ${activeFormats.ul ? "bg-teal-100 text-teal-700 hover:bg-teal-200" : ""}`}
          onMouseDown={(e) => { e.preventDefault(); executeCommand("insertUnorderedList"); }} title="Danh sách chấm tròn"
        >
          <List className="w-4 h-4" />
        </Button>
        <Button
          type="button" variant="ghost" size="icon" className={`h-8 w-8 ${activeFormats.ol ? "bg-teal-100 text-teal-700 hover:bg-teal-200" : ""}`}
          onMouseDown={(e) => { e.preventDefault(); executeCommand("insertOrderedList"); }} title="Danh sách số"
        >
          <ListOrdered className="w-4 h-4" />
        </Button>

        <span className="w-px h-6 bg-gray-200 mx-1 shrink-0" />

        {/* Alignments */}
        <Button
          type="button" variant="ghost" size="icon" className={`h-8 w-8 ${activeFormats.justifyLeft ? "bg-teal-100 text-teal-700 hover:bg-teal-200" : ""}`}
          onMouseDown={(e) => { e.preventDefault(); executeCommand("justifyLeft"); }} title="Căn lề trái"
        >
          <AlignLeft className="w-4 h-4" />
        </Button>
        <Button
          type="button" variant="ghost" size="icon" className={`h-8 w-8 ${activeFormats.justifyCenter ? "bg-teal-100 text-teal-700 hover:bg-teal-200" : ""}`}
          onMouseDown={(e) => { e.preventDefault(); executeCommand("justifyCenter"); }} title="Căn giữa"
        >
          <AlignCenter className="w-4 h-4" />
        </Button>
        <Button
          type="button" variant="ghost" size="icon" className={`h-8 w-8 ${activeFormats.justifyRight ? "bg-teal-100 text-teal-700 hover:bg-teal-200" : ""}`}
          onMouseDown={(e) => { e.preventDefault(); executeCommand("justifyRight"); }} title="Căn lề phải"
        >
          <AlignRight className="w-4 h-4" />
        </Button>

        <span className="w-px h-6 bg-gray-200 mx-1 shrink-0" />

        {/* Insert links/media */}
        <Button
          type="button" variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:bg-blue-50"
          onMouseDown={(e) => { e.preventDefault(); handleLinkClick(); }} title="Chèn liên kết (Link)"
        >
          <Link className="w-4 h-4" />
        </Button>
        <Button
          type="button" variant="ghost" size="icon" className="h-8 w-8 text-amber-600 hover:bg-amber-50"
          onMouseDown={(e) => { e.preventDefault(); saveSelection(); setImgOpen(true); }} title="Chèn hình ảnh"
        >
          <Image className="w-4 h-4" />
        </Button>
        <Button
          type="button" variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:bg-red-50"
          onMouseDown={(e) => { e.preventDefault(); handleYoutubeClick(); }} title="Chèn video Youtube"
        >
          <Video className="w-4 h-4" />
        </Button>

        <span className="w-px h-6 bg-gray-200 mx-1 shrink-0" />

        <Button
          type="button" variant="ghost" size="sm" className={`h-8 gap-1.5 px-2.5 font-bold ${showSource ? "bg-teal-100 text-teal-700 hover:bg-teal-200" : ""}`}
          onMouseDown={(e) => { e.preventDefault(); setShowSource(!showSource); }} title="Xem code HTML"
        >
          <Code className="w-3.5 h-3.5" />
          <span className="text-xs">HTML</span>
        </Button>
      </div>

      {/* Editor Body */}
      <div className="relative min-h-[480px]">
        {showSource ? (
          <textarea
            value={htmlValue}
            onChange={handleSourceChange}
            className="w-full min-h-[480px] p-4 font-mono text-xs text-gray-700 bg-gray-50 border-0 outline-none focus:ring-0 resize-y"
            placeholder="Mã HTML bài viết..."
          />
        ) : (
          <div
            ref={editorRef}
            contentEditable
            onInput={handleInput}
            onClick={handleEditorClick}
            onBlur={() => { saveSelection(); updateActiveFormats(); }}
            onMouseUp={() => { saveSelection(); updateActiveFormats(); }}
            onKeyUp={() => { saveSelection(); updateActiveFormats(); }}
            className="prose prose-sm md:prose-base max-w-none w-full min-h-[480px] p-4 md:p-6 outline-none bg-white overflow-y-auto max-h-[600px] text-gray-800 focus:outline-none"
            placeholder={placeholder}
            style={{
              fontFamily: "inherit",
              lineHeight: "1.6",
            }}
          />
        )}
      </div>

      {/* Image Dialog - uses onCloseAutoFocus override to preserve editor range selection */}
      <Dialog open={imgOpen} onOpenChange={setImgOpen}>
        <DialogContent 
          className="max-w-md bg-white z-50"
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>Chèn hình ảnh</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <ImagePicker
              label="Chọn ảnh từ kho"
              value={imgUrl}
              onChange={(url) => setImgUrl(url)}
            />
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500">Hoặc nhập URL ảnh từ bên ngoài</label>
              <Input
                value={imgUrl}
                onChange={(e) => setImgUrl(e.target.value)}
                placeholder="https://example.com/image.png"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setImgOpen(false)}>Hủy</Button>
            <Button onClick={handleImageSubmit} className="bg-teal-600 hover:bg-teal-700" disabled={!imgUrl}>Chèn ảnh</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
