import { FalkorDB } from 'falkordb'
import { config } from '../config/index.js'

let driver = null
let graphInstance = null
let isConnected = false
let connectionError = null

/**
 * Initializes and returns the FalkorDB driver and active Graph instance.
 */
export async function getGraph() {
  if (graphInstance && isConnected) {
    return graphInstance
  }

  try {
    if (!driver) {
      // Connect using configured FalkorDB URL (e.g. redis://user:password@host:port)
      driver = await FalkorDB.connect({
        url: config.falkor.url,
      })
    }

    graphInstance = driver.selectGraph(config.falkor.graphName)
    // Run a quick ping query to verify connection
    await graphInstance.query('RETURN 1 AS ping')
    isConnected = true
    connectionError = null
    console.log(`[FalkorDB] Successfully connected to graph: "${config.falkor.graphName}" at ${config.falkor.url.replace(/:[^:]*@/, ':****@')}`)
    return graphInstance
  } catch (err) {
    isConnected = false
    connectionError = err.message
    console.warn(`[FalkorDB] Connection warning: Unable to reach FalkorDB at ${config.falkor.url.replace(/:[^:]*@/, ':****@')} (${err.message})`)
    console.warn('[FalkorDB] Please verify FALKORDB_URL in backend/.env')
    throw err
  }
}

/**
 * Executes a parameterized Cypher query against FalkorDB.
 * @param {string} cypher - The Cypher query string with $param placeholders
 * @param {Record<string, any>} params - Key-value map of parameters
 */
export async function executeQuery(cypher, params = {}) {
  const graph = await getGraph()
  try {
    const result = await graph.query(cypher, { params })
    return result
  } catch (error) {
    console.error('[FalkorDB] Query execution error:', error.message)
    console.error('[FalkorDB] Failed Cypher:', cypher)
    console.error('[FalkorDB] Query Params:', JSON.stringify(params))
    throw error
  }
}

/**
 * Checks connection health to FalkorDB.
 */
export async function checkFalkorHealth() {
  try {
    const graph = await getGraph()
    const result = await graph.query('RETURN 1 AS status, datetime() AS serverTime')
    return {
      connected: true,
      graph: config.falkor.graphName,
      error: null,
    }
  } catch (err) {
    return {
      connected: false,
      graph: config.falkor.graphName,
      error: err.message,
      help: 'Set FALKORDB_URL in backend/.env with your FalkorDB Cloud connection string.',
    }
  }
}

/**
 * Closes the FalkorDB connection driver gracefully.
 */
export async function closeFalkorConnection() {
  if (driver) {
    try {
      await driver.close()
      console.log('[FalkorDB] Connection closed.')
    } catch (err) {
      console.error('[FalkorDB] Error while closing connection:', err.message)
    } finally {
      driver = null
      graphInstance = null
      isConnected = false
    }
  }
}
