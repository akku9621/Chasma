"use client";
import { useTheme } from "../context/ThemeContext";

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <div style={{ position: "fixed", top: 10, right: 10, zIndex: 9999 }}>
      <select
        value={theme}
        onChange={(e) => setTheme(e.target.value as any)}
        style={{
          padding: "8px 12px",
          borderRadius: "8px",
          border: "1px solid #ccc",
          fontSize: "14px",
          cursor: "pointer"
        }}
      >
        <option value="classic">Classic</option>
        <option value="ocean">Ocean</option>
        <option value="sunset">Sunset</option>
        <option value="forest">Forest</option>
        <option value="royal">Royal</option>
      </select>
    </div>
  );
}
