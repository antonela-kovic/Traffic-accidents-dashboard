import React from "react";
import { causeDisplay } from "../../lib/causeLabels";

export default function KPIHeader({ kpis }) {
  return (
    <div className="kpis">
      <div className="kpi">
        <div className="kpiLabel">Accidents in selection</div>
        <div className="kpiValue">{kpis.total}</div>
      </div>
      <div className="kpi">
        <div className="kpiLabel">Most common known cause</div>
        <div className="kpiValue">{causeDisplay(kpis.topCause)}</div>
      </div>
      <div className="kpi">
        <div className="kpiLabel">Riskiest hour</div>
        <div className="kpiValue">{kpis.peakHour}</div>
      </div>
    </div>
  );
}
