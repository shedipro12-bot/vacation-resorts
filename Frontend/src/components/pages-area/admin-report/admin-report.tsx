import { useEffect, useState } from "react";
import { Alert, Box, Button, Chip, CircularProgress, Container, Paper, Stack, Typography } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { useAdmin } from "../../../hooks/use-admin";
import type { VacationReportModel } from "../../../models/vacation-report-model";
import { reportService } from "../../../services/report-service";
import { notify } from "../../../utils/notify";

// Displays the admin-only vacation likes chart and CSV download.
export function AdminReport() {
    const isAdmin = useAdmin();
    const [rows, setRows] = useState<VacationReportModel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        if (!isAdmin) return;
        let cancelled = false;

        // Fetches the report and ignores results after the page is closed.
        async function loadReport(): Promise<void> {
            setIsLoading(true);
            setHasError(false);

            try {
                const result = await reportService.getVacationsReport();
                if (!cancelled) setRows(result);
            }
            catch (error) {
                if (!cancelled) {
                    setHasError(true);
                    notify.error(error);
                }
            }
            finally {
                if (!cancelled) setIsLoading(false);
            }
        }

        loadReport();
        return () => { cancelled = true; };
    }, [isAdmin, reloadKey]);

    if (!isAdmin) return null;

    const totalLikes = rows.reduce((sum, row) => sum + row.likesCount, 0);

    return (
        <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
            <Stack spacing={3}>
                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={2}
                    sx={{
                        justifyContent: "space-between",
                        alignItems: { xs: "stretch", sm: "center" }
                    }}
                >
                    <Box>
                        <Typography variant="overline" color="secondary.main" sx={{ letterSpacing: 2 }}>ADMINISTRATION</Typography>
                        <Typography variant="h4" component="h1">Vacation reports</Typography>
                        <Typography color="text.secondary" sx={{ mt: 1 }}>See which destinations your travelers like.</Typography>
                    </Box>

                    <Stack direction="row" spacing={1}>
                        <Button variant="outlined" disabled={isLoading} onClick={() => setReloadKey(value => value + 1)}>Refresh</Button>
                        <Button variant="contained" disabled={isLoading || hasError || rows.length === 0} onClick={() => reportService.downloadCsv(rows)}>Download CSV</Button>
                    </Stack>
                </Stack>

                {isLoading ? (
                    <Box role="status" sx={{ py: 8, textAlign: "center" }}>
                        <CircularProgress />
                        <Typography color="text.secondary" sx={{ mt: 2 }}>Loading report...</Typography>
                    </Box>
                ) : hasError ? (
                    <Alert severity="error">The report could not be loaded. Use Refresh to try again.</Alert>
                ) : rows.length === 0 ? (
                    <Alert severity="info">Add a vacation to start building your report.</Alert>
                ) : (
                    <>
                        <Stack direction="row" spacing={1}>
                            <Chip label={`${rows.length} vacations`} color="primary" variant="outlined" />
                            <Chip label={`${totalLikes} total likes`} color="secondary" variant="outlined" />
                        </Stack>

                        <Paper sx={{ p: { xs: 2, md: 3 }, borderRadius: 4 }}>
                            <Typography variant="h5" component="h2">Likes by destination</Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                Hover over a bar for details. Scroll horizontally to view every destination.
                            </Typography>

                            <Box sx={{ overflowX: "auto", mt: 2 }}>
                                <BarChart
                                    width={Math.max(800, rows.length * 110)}
                                    height={420}
                                    xAxis={[{
                                        scaleType: "band",
                                        data: rows.map(row => row.vacationId),
                                        label: "Destination",
                                        valueFormatter: id => rows.find(row => row.vacationId === id)?.destination ?? String(id),
                                        tickLabelStyle: { angle: -35, textAnchor: "end", fontSize: 11 },
                                        height: 110
                                    }]}
                                    yAxis={[{ min: 0, label: "Likes", tickMinStep: 1 }]}
                                    series={[{ data: rows.map(row => row.likesCount), label: "Likes", color: "#087F8C" }]}
                                    grid={{ horizontal: true }}
                                />
                            </Box>
                        </Paper>
                    </>
                )}
            </Stack>
        </Container>
    );
}