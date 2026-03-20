import { useNavigate } from "react-router-dom";
import { Button } from "antd";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { removeFromCompare, clearCompare } from "../store/compareSlice";
import "./CompareBar.css";

export function CompareBar() {
  const names = useAppSelector((s) => s.compare.names);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  if (names.length === 0) return null;

  return (
    <div className="compare-bar">
      <div className="compare-bar-inner">
        <div className="compare-bar-list">
          {names.map((name) => (
            <span key={name} className="compare-bar-chip">
              {name}
              <button
                className="compare-bar-chip-remove"
                onClick={() => dispatch(removeFromCompare(name))}
              >
                &times;
              </button>
            </span>
          ))}
        </div>
        <div className="compare-bar-actions">
          <Button size="small" onClick={() => dispatch(clearCompare())}>
            Clear
          </Button>
          <Button
            type="primary"
            size="small"
            disabled={names.length < 2}
            onClick={() => navigate("/compare")}
          >
            Compare ({names.length})
          </Button>
        </div>
      </div>
    </div>
  );
}
