"""ตารางทั้งหมดต้อง import ที่นี่ ไม่งั้น alembic autogenerate จะมองไม่เห็น"""

from backend.app.db.models.defect_type import DefectType
from backend.app.db.models.inspection import Defect, Inspection
from backend.app.db.models.production_target import ProductionTarget
from backend.app.db.models.station import Station

__all__ = ["DefectType", "Defect", "Inspection", "ProductionTarget", "Station"]
