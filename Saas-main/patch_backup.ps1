$file = 'c:\Users\Meet\Desktop\New folder\Saas-main\frontend\src\App.tsx'
$content = Get-Content $file -Raw

$oldBlock = @'
                  {/* 8. Settings Backup & Restore Tab */}

                  {activeTab === "settings" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

                      <h3 style={{ fontWeight: 700 }}>Database backup & JSON restore</h3>

                      <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)" }}>

                        Export your entire store database (products, sales logs, suppliers outstanding ledger, staff profiles, attendance sheets) to a single JSON file. You can restore your data at any time.

                      </p>



                      <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1rem" }}>
                        <button onClick={handleExportBackup} className="btn btn-primary" style={{ justifyContent: "center" }}>

                          <Download size={16} /> Export JSON Database Backup
                        </button>

                        

                        <div style={{ border: "1px dashed var(--color-border)", borderRadius: "12px", padding: "1.5rem", textAlign: "center", backgroundColor: "#FFFFFF" }}>

                          <label style={{ cursor: "pointer", fontWeight: 700, color: "var(--color-accent-red)", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>

                            <RefreshCw size={24} />

                            <span>Upload JSON Backup to Restore</span>

                            <input 

                              type="file" 

                              ref={fileInputRef} 

                              accept=".json" 

                              onChange={handleImportBackup} 

                              style={{ display: "none" }} 

                            />

                          </label>
                        </div>

                      </div>



                      <div style={{ borderTop: "1px solid var(--color-border)", paddingTop: "1rem", marginTop: "1rem" }}>
                        <h4 style={{ fontWeight: 700, marginBottom: "0.5rem" }}>Warehouse Management</h4>

                        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1rem" }}>

                          {warehousesList.map(w => (

                            <div key={w.id} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", padding: "0.4rem 0.6rem", border: "1px solid var(--color-border)", borderRadius: "6px", backgroundColor: "#FFFFFF" }}>
                              <span><strong>{w.name}</strong> ({w.location || "N/A"})</span>

                            </div>

                          ))}
                        </div>



                        <form onSubmit={async (e) => {
                          e.preventDefault();

                          if (!store) return;

                          const name = (e.target as any).wName.value;
                          const loc = (e.target as any).wLoc.value;
                          if (!name) return;
                          try {

                            const res = await fetch(`${BACKEND_URL}/api/stores/${store.id}/warehouses`, {
                              method: "POST",

                              headers: { "Content-Type": "application/json" },

                              body: JSON.stringify({ name, location: loc })
                            });
                            if (res.ok) {
                              const newW = await res.json();
                              setWarehousesList(prev => [...prev, newW]);

                              (e.target as any).reset();
                              alert("Warehouse successfully registered!");
                            }
                          } catch (err) {

                            console.error(err);
                          }

                        }} style={{ display: "flex", gap: "0.5rem" }}>
                          <input type="text" name="wName" required placeholder="Warehouse Name" style={{ flex: 1, padding: "0.4rem", borderRadius: "6px", border: "1px solid var(--color-border)", fontSize: "0.82rem" }} />


                          <input type="text" name="wLoc" placeholder="Location" style={{ flex: 1, padding: "0.4rem", borderRadius: "6px", border: "1px solid var(--color-border)", fontSize: "0.82rem" }} />
'@

$newBlock = @'
                  {/* 8. Backup & Restore Tab */}
                  {activeTab === "settings" && (() => {
                    const COLLECTIONS = [
                      { key: "products",   label: "Products",   icon: "📦", desc: "Catalog, prices, stock" },
                      { key: "sales",      label: "Sales",      icon: "🧾", desc: "POS invoices & transactions" },
                      { key: "expenses",   label: "Expenses",   icon: "💸", desc: "Logged expense entries" },
                      { key: "cashflows",  label: "Cash Flows", icon: "💰", desc: "Inflow & outflow ledger" },
                      { key: "suppliers",  label: "Suppliers",  icon: "🏭", desc: "Supplier directory & balances" },
                      { key: "employees",  label: "Employees",  icon: "👥", desc: "Staff profiles & salaries" },
                      { key: "attendance", label: "Attendance", icon: "📅", desc: "Daily attendance logs" },
                      { key: "customers",  label: "Customers",  icon: "🙋", desc: "CRM, loyalty & credit" },
                    ];
                    return (
                      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                        {/* Export */}
                        <div style={{ padding: "1.25rem", border: "1px solid var(--color-border)", borderRadius: "12px", backgroundColor: "#FAFAFA" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.85rem" }}>
                            <div>
                              <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>Export Backup</div>
                              <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", marginTop: "0.1rem" }}>Choose collections to include in the JSON file</div>
                            </div>
                            <div style={{ display: "flex", gap: "0.4rem" }}>
                              <button onClick={() => setBackupSelections(COLLECTIONS.map(c => c.key))} className="btn btn-secondary" style={{ padding: "0.25rem 0.6rem", fontSize: "0.75rem" }}>All</button>
                              <button onClick={() => setBackupSelections([])} className="btn btn-secondary" style={{ padding: "0.25rem 0.6rem", fontSize: "0.75rem" }}>None</button>
                            </div>
                          </div>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.45rem", marginBottom: "1rem" }}>
                            {COLLECTIONS.map(col => {
                              const checked = backupSelections.includes(col.key);
                              const count = backupCounts[col.key];
                              return (
                                <label key={col.key} style={{ display: "flex", alignItems: "center", gap: "0.55rem", padding: "0.6rem 0.75rem", border: `1.5px solid ${checked ? "var(--color-accent-red)" : "var(--color-border)"}`, borderRadius: "8px", cursor: "pointer", backgroundColor: checked ? "rgba(148,63,63,0.04)" : "#FFFFFF", transition: "all 0.15s" }}>
                                  <input type="checkbox" checked={checked} onChange={() => setBackupSelections(prev => checked ? prev.filter(k => k !== col.key) : [...prev, col.key])} style={{ width: "14px", height: "14px", accentColor: "var(--color-accent-red)", cursor: "pointer", flexShrink: 0 }} />
                                  <span style={{ fontSize: "0.95rem" }}>{col.icon}</span>
                                  <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontWeight: 600, fontSize: "0.82rem" }}>{col.label}</div>
                                    <div style={{ fontSize: "0.68rem", color: "var(--color-text-muted)" }}>{col.desc}</div>
                                  </div>
                                  {count !== undefined && <span style={{ fontSize: "0.7rem", fontWeight: 700, padding: "0.1rem 0.4rem", borderRadius: "10px", backgroundColor: count > 0 ? "rgba(148,63,63,0.1)" : "#F0F0F0", color: count > 0 ? "var(--color-accent-red)" : "var(--color-text-muted)", flexShrink: 0 }}>{count}</span>}
                                </label>
                              );
                            })}
                          </div>
                          <button
                            disabled={backupSelections.length === 0 || backupLoading}
                            onClick={async () => {
                              if (!store) return;
                              setBackupLoading(true);
                              try {
                                const res = await fetch(`${BACKEND_URL}/api/stores/${store.id}/backup`);
                                if (!res.ok) throw new Error();
                                const full = await res.json();
                                const out: Record<string, any> = { store_id: full.store_id, exported_at: full.exported_at, schema_version: full.schema_version };
                                backupSelections.forEach(k => { if (full[k]) out[k] = full[k]; });
                                const blob = new Blob([JSON.stringify(out, null, 2)], { type: "application/json" });
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement("a"); a.href = url;
                                a.download = `${store.slug}_backup_${new Date().toISOString().slice(0,10)}.json`;
                                a.click(); URL.revokeObjectURL(url);
                                setLastBackupTime(new Date().toLocaleString("en-IN"));
                              } catch { alert("Export failed."); }
                              finally { setBackupLoading(false); }
                            }}
                            className="btn btn-primary"
                            style={{ width: "100%", justifyContent: "center", padding: "0.65rem", borderRadius: "8px", opacity: backupSelections.length === 0 ? 0.5 : 1 }}
                          >
                            <Download size={14} /> {backupLoading ? "Exporting..." : `Export ${backupSelections.length} Collection${backupSelections.length !== 1 ? "s" : ""} as JSON`}
                          </button>
                          {lastBackupTime && <div style={{ marginTop: "0.5rem", fontSize: "0.72rem", color: "var(--color-text-muted)", textAlign: "center" }}>Last exported: {lastBackupTime}</div>}
                        </div>
                        {/* Restore */}
                        <div style={{ padding: "1.25rem", border: "1px solid var(--color-border)", borderRadius: "12px", backgroundColor: "#FAFAFA" }}>
                          <div style={{ fontWeight: 700, fontSize: "0.95rem", marginBottom: "0.25rem" }}>Restore from Backup</div>
                          <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", marginBottom: "1rem" }}>Upload a JSON backup file. Only collections present in the file will be overwritten.</div>
                          {restorePreview ? (
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                              <div style={{ padding: "0.85rem", backgroundColor: "#FFF8E1", border: "1px solid #FFE082", borderRadius: "8px", fontSize: "0.82rem" }}>
                                <div style={{ fontWeight: 700, marginBottom: "0.35rem" }}>Review before restoring</div>
                                <div style={{ color: "var(--color-text-muted)", marginBottom: "0.5rem" }}>Exported: {restorePreview.exported_at ? new Date(restorePreview.exported_at).toLocaleString("en-IN") : "Unknown"} · Schema v{restorePreview.schema_version || "1"}</div>
                                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem" }}>
                                  {COLLECTIONS.filter(c => restorePreview[c.key]).map(c => (
                                    <span key={c.key} style={{ padding: "0.15rem 0.45rem", borderRadius: "10px", backgroundColor: "rgba(148,63,63,0.1)", color: "var(--color-accent-red)", fontWeight: 600, fontSize: "0.7rem" }}>{c.icon} {c.label} ({restorePreview[c.key]?.length ?? 0})</span>
                                  ))}
                                </div>
                              </div>
                              <div style={{ display: "flex", gap: "0.5rem" }}>
                                <button disabled={backupLoading} onClick={async () => {
                                  if (!store || !confirm("This will REPLACE existing data for the selected collections. Continue?")) return;
                                  setBackupLoading(true);
                                  try {
                                    const res = await fetch(`${BACKEND_URL}/api/stores/${store.id}/restore`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(restorePreview) });
                                    if (!res.ok) throw new Error();
                                    const result = await res.json();
                                    alert(`Restored: ${result.restored_collections?.join(", ") || "done"}`);
                                    setRestorePreview(null);
                                    const pRes = await fetch(`${BACKEND_URL}/api/stores/${store.id}`);
                                    if (pRes.ok) { const d = await pRes.json(); setProducts(d.products || []); }
                                    fetchSales(store.id); fetchSuppliers(store.id); fetchEmployees(store.id); fetchAttendance(store.id); fetchBackupCounts(store.id);
                                  } catch { alert("Restore failed. Invalid or incompatible backup file."); }
                                  finally { setBackupLoading(false); }
                                }} className="btn btn-primary" style={{ flex: 1, justifyContent: "center", backgroundColor: "#D32F2F", borderColor: "#D32F2F" }}>
                                  {backupLoading ? "Restoring..." : "Confirm Restore"}
                                </button>
                                <button onClick={() => setRestorePreview(null)} className="btn btn-secondary">Cancel</button>
                              </div>
                            </div>
                          ) : (
                            <label style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem", padding: "1.5rem", border: "2px dashed var(--color-border)", borderRadius: "10px", cursor: "pointer", backgroundColor: "#FFFFFF" }}
                              onDragOver={e => e.preventDefault()}
                              onDrop={e => { e.preventDefault(); const file = e.dataTransfer.files[0]; if (!file) return; const reader = new FileReader(); reader.onload = ev => { try { setRestorePreview(JSON.parse(ev.target?.result as string)); } catch { alert("Invalid JSON file."); } }; reader.readAsText(file); }}
                            >
                              <RefreshCw size={22} style={{ color: "var(--color-accent-red)" }} />
                              <span style={{ fontWeight: 600, fontSize: "0.88rem" }}>Click or drag and drop a backup JSON</span>
                              <span style={{ fontSize: "0.72rem", color: "var(--color-text-muted)" }}>Only collections in the file will be restored</span>
                              <input type="file" ref={fileInputRef} accept=".json" style={{ display: "none" }} onChange={e => { const file = e.target.files?.[0]; if (!file) return; const reader = new FileReader(); reader.onload = ev => { try { setRestorePreview(JSON.parse(ev.target?.result as string)); } catch { alert("Invalid JSON file."); } }; reader.readAsText(file); e.target.value = ""; }} />
                            </label>
                          )}
                        </div>
                        {/* Warehouse */}
                        <div style={{ padding: "1.25rem", border: "1px solid var(--color-border)", borderRadius: "12px", backgroundColor: "#FAFAFA" }}>
                          <div style={{ fontWeight: 700, fontSize: "0.95rem", marginBottom: "0.75rem" }}>Warehouse Management</div>
                          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", marginBottom: "0.75rem" }}>
                            {warehousesList.map(w => (
                              <div key={w.id} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem", padding: "0.4rem 0.6rem", border: "1px solid var(--color-border)", borderRadius: "6px", backgroundColor: "#FFFFFF" }}>
                                <span><strong>{w.name}</strong>{w.location ? ` · ${w.location}` : ""}</span>
                              </div>
                            ))}
                          </div>
                          <form onSubmit={async e => {
                            e.preventDefault(); if (!store) return;
                            const name = (e.target as any).wName.value; const loc = (e.target as any).wLoc.value; if (!name) return;
                            try { const res = await fetch(`${BACKEND_URL}/api/stores/${store.id}/warehouses`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, location: loc }) }); if (res.ok) { const d = await res.json(); setWarehousesList(prev => [...prev, d]); (e.target as any).reset(); } } catch { console.error("warehouse add failed"); }
                          }} style={{ display: "flex", gap: "0.5rem" }}>
                            <input type="text" name="wName" required placeholder="Warehouse Name" style={{ flex: 1, padding: "0.4rem", borderRadius: "6px", border: "1px solid var(--color-border)", fontSize: "0.82rem" }} />
                            <input type="text" name="wLoc" placeholder="Location" style={{ flex: 1, padding: "0.4rem", borderRadius: "6px", border: "1px solid var(--color-border)", fontSize: "0.82rem" }} />
'@

if ($content.Contains($oldBlock)) {
    $newContent = $content.Replace($oldBlock, $newBlock)
    Set-Content $file $newContent -NoNewline -Encoding UTF8
    Write-Host "SUCCESS: Block replaced"
} else {
    Write-Host "FAIL: Old block not found"
    # Try to find partial match
    $lines = $oldBlock -split "`n"
    $firstLine = $lines[0].Trim()
    Write-Host "Looking for: $firstLine"
}
