type ConfirmType = "approve" | "reject";

type ConfirmProps = {
    isOpen: boolean;
    confirmType: ConfirmType | null;
    missionTitle: string;
    onCancel: () => void;
    onConfirm: () => void;
};

export function ConfirmComponent({
    isOpen,
    confirmType,
    missionTitle,
    onCancel,
    onConfirm,
}: ConfirmProps) {
    if (!isOpen || !confirmType) return null;

    const isApprove = confirmType === "approve";
    const actionText = isApprove ? "approve" : "reject";

    return (
        <div className="fixed inset-0 z-[3000] bg-black/60 flex items-center justify-center p-4">
            <div className="w-full max-w-md rounded-md border-4 border-black bg-[#fffbe6] p-5 text-[#2c1810] shadow-[8px_8px_0_#000]">
                <h3 className="mb-2 text-sm font-bold uppercase">Confirm action</h3>
                <p className="mb-4 text-lg">
                    Are you sure you want to {actionText} <strong>{missionTitle}</strong>?
                </p>
                <div className="flex justify-end gap-2">
                    <button type="button" className="pixel-btn pixel-btn-blue" onClick={onCancel}>
                        Cancel
                    </button>
                    <button
                        type="button"
                        className={`pixel-btn ${isApprove ? "pixel-btn-green" : "pixel-btn-red"}`}
                        onClick={onConfirm}
                    >
                        Yes, {actionText}
                    </button>
                </div>
            </div>
        </div>
    );
}