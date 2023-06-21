import React, { useEffect, useState } from 'react';

import { FilterMatchMode } from 'primereact/api';
import { Column } from 'primereact/column';
import { DataTable, DataTableFilterMeta } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';

import songlist from './assets/songlist.csv?url';

interface Song {
    id: string;
    Artist: string;
    Title: string;
    Language: string;
    Year: string;
}

function parseCSV(csvText: string, separator = ';') {
    const lines = csvText.split('\n');
    const headers = lines[0].split(separator);
    const csvData = [];

    for (let i = 1; i < lines.length; i++) {
        const currentLine = lines[i].split(separator);
        if (currentLine.length !== headers.length) {
            // Skip the line if the number of columns doesn't match the headers
            continue;
        }
        const row = {
            id: i,
        };
        for (let j = 0; j < headers.length; j++) {
            // @ts-ignore
            row[headers[j].trim()] = currentLine[j].trim();
        }
        csvData.push(row);
    }

    return csvData;
}

export default function BasicDemo() {
    const [songs, setSongs] = useState<Song[]>([]);
    const [globalFilterValue, setGlobalFilterValue] = useState<string>('');

    const [filters, setFilters] = useState<DataTableFilterMeta>({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });

    const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // @ts-ignore
        let _filters = { ...filters };
        // @ts-ignore
        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const renderHeader = () => {
        return (
            <div className="flex justify-content-start">
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText
                        value={globalFilterValue}
                        onChange={onGlobalFilterChange}
                        placeholder="Search Song"
                    />
                </span>
            </div>
        );
    };

    const header = renderHeader();

    const renderFooter = () => (
        <div className="flex justify-content-start">
            <span className="p-input-icon-left">
                {`In total there are ${songs ? songs.length : 0} songs.`}
            </span>
        </div>
    );

    const footer = renderFooter();

    useEffect(() => {
        fetch(songlist)
            .then((response) => response.text())
            .then((csvText) => {
                const csvData = parseCSV(csvText);
                // @ts-ignore
                setSongs(csvData);
            })
            .catch((error) => {
                console.error('Error fetching the CSV:', error);
            });
    }, []);

    return (
        <div className="card">
            <div className="py-4">
                I (André "MG" Wisén) have created my own SingStar™. Here's a list of songs that are
                available.
            </div>
            <DataTable
                value={songs}
                scrollable
                scrollHeight="60vh"
                filters={filters}
                header={header}
                footer={footer}
                stripedRows
                showGridlines
            >
                <Column field="Artist" header="Artist" sortable />
                <Column field="Title" header="Title" sortable />
                <Column field="Language" header="Language" sortable />
                <Column field="Year" header="Year" sortable />
            </DataTable>
        </div>
    );
}
