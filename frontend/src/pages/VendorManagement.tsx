import { useState, useEffect } from "react";
import {
    Card, Table, Input, Tag, Button, Modal,
    Descriptions, Flex, Typography,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { SearchOutlined } from "@ant-design/icons";
import { api } from "../api/client";

type VendorRow = {
    id: number;
    vendor_code: string;
    name: string;
    city?: string;
    state?: string;
    is_active: number;
    performance_score?: number;
    contact_person?: string;
    phone?: string;
    service_areas?: string;
    updated_ts: string;
};


function scoreColor(score?: number): string {
    if (score == null) return "#8c8c8c";
    if (score >= 80) return "#52c41a";
    if (score >= 60) return "#faad14";
    return "#ff4d4f";
}

export default function VendorManagement() {
    const [vendors, setVendors] = useState<VendorRow[]>([]);
    const [loading, setLoading] = useState(false);

    // City search
    const [cityInput, setCityInput] = useState("");
    const [searchResults, setSearchResults] = useState<VendorRow[] | null>(null);
    const [searchedCity, setSearchedCity] = useState("");

    // Vendor detail modal
    const [modalOpen, setModalOpen] = useState(false);
    const [detailVendor, setDetailVendor] = useState<VendorRow | null>(null);

    useEffect(() => {
        setLoading(true);
        api
            .get("/api/vendors")
            .then((res) => setVendors(res.data))
            .catch((err) => console.error("Failed to fetch vendors:", err))
            .finally(() => setLoading(false));
    }, []);

    function handleCitySearch() {
        const q = cityInput.trim().toLowerCase();
        if (!q) {
            setSearchResults(null);
            setSearchedCity("");
            return;
        }
        setSearchedCity(cityInput.trim());
        setSearchResults(vendors.filter((v) => v.city?.toLowerCase().includes(q)));
    }

    function handleViewDetails(vendor: VendorRow) {
        setDetailVendor(vendor);
        setModalOpen(true);
    }

    function closeModal() {
        setModalOpen(false);
        setDetailVendor(null);
    }

    const scoreCell = (val?: number) => (
        <span style={{ fontWeight: 600, color: scoreColor(val) }}>
            {val != null ? Number(val).toFixed(1) : "—"}
        </span>
    );

    const activeCell = (val: number) =>
        val ? <Tag color="success">Active</Tag> : <Tag color="error">Inactive</Tag>;

    const detailsBtn = (_: unknown, record: VendorRow) => (
        <Button size="small" onClick={() => handleViewDetails(record)}>
            View Details
        </Button>
    );

    const columns: ColumnsType<VendorRow> = [
        { title: "Vendor Code", dataIndex: "vendor_code", key: "vendor_code", width: 130 },
        { title: "Name", dataIndex: "name", key: "name", width: 220 },
        { title: "City", dataIndex: "city", key: "city", width: 130 },
        { title: "State", dataIndex: "state", key: "state", width: 100 },
        { title: "Status", dataIndex: "is_active", key: "is_active", width: 90, render: activeCell },
        {
            title: "Performance Score",
            dataIndex: "performance_score",
            key: "performance_score",
            width: 160,
            sorter: (a, b) => (a.performance_score ?? 0) - (b.performance_score ?? 0),
            render: scoreCell,
        },
        { title: "", key: "action", width: 120, render: detailsBtn },
    ];

    return (
        <Flex vertical gap={16}>
            <Flex style={{ width: "100%", justifyContent: "space-between" }} align="center">
                <Typography.Title level={4} style={{ margin: 0 }}>
                    Vendor Management
                </Typography.Title>
                <Typography.Text type="secondary">Vendor Performance Overview</Typography.Text>
            </Flex>

            {/* City Search */}
            <Card title="Search Vendors by City">
                <Flex gap={12} align="center">
                    <Input
                        placeholder="Enter city name..."
                        prefix={<SearchOutlined />}
                        value={cityInput}
                        onChange={(e) => {
                            setCityInput(e.target.value);
                            if (!e.target.value) {
                                setSearchResults(null);
                                setSearchedCity("");
                            }
                        }}
                        onPressEnter={handleCitySearch}
                        style={{ maxWidth: 320 }}
                        allowClear
                    />
                    <Button type="primary" onClick={handleCitySearch} disabled={loading}>
                        Search
                    </Button>
                </Flex>

                {searchResults !== null && (
                    <div style={{ marginTop: 16 }}>
                        <Typography.Text strong>
                            {searchResults.length > 0
                                ? `${searchResults.length} vendor${searchResults.length === 1 ? "" : "s"} found in "${searchedCity}"`
                                : `No vendors found in "${searchedCity}"`}
                        </Typography.Text>
                        {searchResults.length > 0 && (
                            <Table<VendorRow>
                                rowKey="id"
                                columns={columns}
                                dataSource={searchResults}
                                pagination={false}
                                scroll={{ x: 900 }}
                                style={{ marginTop: 12 }}
                            />
                        )}
                    </div>
                )}
            </Card>

            {/* All Vendors */}
            <Card title="All Vendors">
                <Table<VendorRow>
                    rowKey="id"
                    columns={columns}
                    dataSource={vendors}
                    loading={loading}
                    pagination={{ pageSize: 10 }}
                    scroll={{ x: 900 }}
                    locale={{ emptyText: "No vendors loaded yet" }}
                />
            </Card>

            {/* Vendor Detail Modal */}
            <Modal
                title={detailVendor ? `${detailVendor.name} — Details` : "Vendor Details"}
                open={modalOpen}
                onCancel={closeModal}
                footer={<Button onClick={closeModal}>Close</Button>}
                width={620}
            >
                {detailVendor && (
                    <Flex vertical gap={16}>
                        <Descriptions bordered size="small" column={2} title="Vendor Info">
                            <Descriptions.Item label="Vendor Code">{detailVendor.vendor_code}</Descriptions.Item>
                            <Descriptions.Item label="Name">{detailVendor.name}</Descriptions.Item>
                            <Descriptions.Item label="City">{detailVendor.city || "—"}</Descriptions.Item>
                            <Descriptions.Item label="State">{detailVendor.state || "—"}</Descriptions.Item>
                            <Descriptions.Item label="Contact Person">{detailVendor.contact_person || "—"}</Descriptions.Item>
                            <Descriptions.Item label="Phone">{detailVendor.phone || "—"}</Descriptions.Item>
                            <Descriptions.Item label="Service Areas" span={2}>
                                {detailVendor.service_areas
                                    ? (() => {
                                        try {
                                            const areas: string[] = JSON.parse(detailVendor.service_areas);
                                            return (
                                                <Flex gap={4} wrap>
                                                    {areas.map((a) => <Tag key={a}>{a}</Tag>)}
                                                </Flex>
                                            );
                                        } catch {
                                            return detailVendor.service_areas;
                                        }
                                    })()
                                    : "—"}
                            </Descriptions.Item>
                            <Descriptions.Item label="Status" span={2}>
                                {detailVendor.is_active
                                    ? <Tag color="success">Active</Tag>
                                    : <Tag color="error">Inactive</Tag>}
                            </Descriptions.Item>
                        </Descriptions>

                    </Flex>
                )}
            </Modal>
        </Flex>
    );
}
