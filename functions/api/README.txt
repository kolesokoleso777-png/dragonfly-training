API ROUTES
GET /api/health   Confirms Pages Function can query D1 through binding DB.
GET /api/data?key=org
GET /api/data?key=state:dfx_s_<staff-id> (also dfx_mgr_v1 / dfx_v1)
PUT /api/data     JSON body: {"key":"org or state:...","value":{...}}

IMPORTANT SECURITY STATUS
This adapter is for controlled cross-device integration testing only. The data route
currently does not enforce server-side user sessions or role-based authorization.
Do not use with real employee personal data or treat it as production-secure. Before
production, replace this adapter with authenticated endpoints that validate manager
passwords and employee codes server-side, issue signed sessions, and authorize each
record by organization and role. The frontend's existing password hash is not a
secure password hash and is not server-side authentication.
