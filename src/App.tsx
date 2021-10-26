import React from 'react'
import {DataQuery} from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import classes from './App.module.css'

const query = {
    me: {
        resource: 'me',
    },
}

const MyApp = () => (
    <div className={classes.container}>
        <DataQuery query={query}>
            {({error, loading, data}) => {
                if (error) return <span>ERROR</span>
                if (loading) return <span>...</span>
                return (
                    <>
                        <h1>{i18n.t('Welcome to The Bottleneck Analysis App!')}</h1>
                    </>
                )
            }}
        </DataQuery>
    </div>
)

export default MyApp
