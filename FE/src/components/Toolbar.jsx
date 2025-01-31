import { useState } from "react";
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  ChevronDown,
  Plus,
  MessageSquare,
  FlipHorizontal as DragDropHorizontal,
  X,
} from "lucide-react";
import Typography from "../assets/Typography.svg"
import Color from "../assets/Color.svg"
import Layout from "../assets/Layout.svg"
import QuickActionHeader from "./QuickActionHeader";

export default function Toolbar(){

    const [selectedOption, setSelectedOption] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [fontColor, setFontColor] = useState("#83D5C7");
    const [colors, setColors] = useState([
        { label: "primary", color: "#83D5C7" },
        { label: "secondary", color: "#83D5C7" },
        { label: "tertiary", color: "#83D5C7" },
        { label: "background", color: "#83D5C7" },
    ]);
  
    const handleSelect = (option) => {
      setSelectedOption(option);
      setIsOpen(false); // Close the dropdown after selection
    };

    const handleColorChange = (index, newColor) => {
        const updatedColors = [...colors];
        updatedColors[index] = { ...updatedColors[index], color: newColor };
        setColors(updatedColors);
    };
  
    const toggleDropdown = () => {
      setIsOpen(!isOpen);
    };
    return <>
    <div className="mt-6 flex flex-col gap-6">
      <div className="flex flex-col gap-2">
       <QuickActionHeader source={Typography} heading={"Typography"} />
       {/* dropdown for fonts */}
       <div className="relative flex w-full items-center">
      <div
        className="flex w-full items-center justify-between bg-[#1C1B1B] text-sm text-white px-2.5 py-2 rounded-xl border border-[#313030] cursor-pointer"
        onClick={toggleDropdown}
      >
        <span className="text-[#C9C6C5]">{selectedOption || 'Select font'}</span>
        <ChevronDown className="ml-2" />
      </div>
      {/* Custom Dropdown Options */}
      {isOpen && (
        <div className="absolute mt-1 z-10 w-full bg-[#1C1B1B] text-white border border-[#313030] rounded-xl shadow-lg">
          <div
            className="px-2.5 py-2 cursor-pointer rounded-t-xl hover:bg-[#313030]"
            onClick={() => handleSelect('Montserrat')}
          >
            Montserrat
          </div>
          <div
            className="px-2.5 py-2 cursor-pointer hover:bg-[#313030]"
            onClick={() => handleSelect('Poppins')}
          >
            Poppins
          </div>
          <div
            className="px-2.5 py-2 cursor-pointer rounded-b-xl hover:bg-[#313030]"
            onClick={() => handleSelect('Massilia')}
          >
            Massilia
          </div>
        </div>
      )}
    </div>
    {/* font size and color option */}
    <div className="flex gap-10">
        <div className="flex flex-col gap-1">
            <p className="text-[#C9C6C5] text-sm">Font Size</p>
            <div className="flex items-center gap-2">
            <input type="number" placeholder="16"  className="h-10 w-[50px] placeholder-[#C9C6C5] text-sm outline-none px-4 bg-theme-gray-primary border border-[#313030] rounded-xl text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"></input>
            <p className="text-[#C9C6C5] text-sm">px</p>
            </div>
            </div>
            <div className="flex flex-col gap-1">
            <span className="mr-4 text-[#C9C6C5] text-sm">Font Color</span>
            <div
              className="h-10 rounded-xl border-[#313030] cursor-pointer relative overflow-hidden"
              style={{ backgroundColor: fontColor }}
            >
              <input
                type="color"
                value={fontColor}
                onChange={(e) => setFontColor(e.target.value)}
                className="absolute h-10 w-full inset-0 opacity-0 cursor-pointer"
              />
            </div>
          </div>
      </div>
      </div>
      <div>
       <QuickActionHeader source={Color} heading={"Color"} />
       <div className="grid grid-cols-2 gap-4">
          {colors.map((item, index) => (
            <div key={index} className="flex items-center mt-2">
              <div className="flex gap-2">
                <div
                  className="size-10 rounded-xl relative overflow-hidden"
                  style={{ backgroundColor: item.color }}
                >
                  <input
                    type="color"
                    value={item.color}
                    onChange={(e) => handleColorChange(index, e.target.value)}
                    className="absolute size-10 inset-0 opacity-0 cursor-pointer"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm">{item.label}</span>
                  <span className="text-sm text-gray-400">{item.color}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>    
      {/* <div>
       <QuickActionHeader source={Layout} heading={"Layout"} />
      </div> */}
    </div>
    {/*Apply Changes Button*/}
    <div>
        <button className="w-full bg-theme-purple-primary border border-theme-purple-secondary py-2 items-center rounded-xl">Apply Changes</button>
    </div>
    </>
};

