## Groupe

- Mahamadou GORY KANTÉ
- Salahe-eddine BOUHDJEUR

## Installation

```bash
docker-compose up -d
```

### Seed Neo4j

```bash
docker exec -it neo4j cypher-shell -u neo4j -p password -f ./import/seed-neo4j.cypher
```

### Database Schema

## MongoDB

```mermaid
graph LR
    subgraph MongoDB Schema
        A[Affaires] --> |embed| T(Temoignages)
        A --> |reference| L(Lieux)
        A --> |reference| I(Individus)
        I --> |embed| C(Contacts)
        AP[Appels] --> |reference| I
    end

    style A fill:#d9f7ff,stroke:#000,stroke-width:2px
    style T fill:#d9f7ff,stroke:#000,stroke-width:2px
    style L fill:#d9f7ff,stroke:#000,stroke-width:2px
    style I fill:#d9f7ff,stroke:#000,stroke-width:2px
    style AP fill:#d9f7ff,stroke:#000,stroke-width:2px
    style C fill:#d9f7ff,stroke:#000,stroke-width:2px
```

## Neo4j

```mermaid
graph LR
    subgraph Neo4j Schema
        N_I((Individu)) -->|SUSPECTE_DANS| N_A((Affaire))
        N_I -->|TEMOIN_DANS| N_A
        N_I -->|A_APPELE| N_I
        N_I -->|PRESENT_A| N_L((Lieu))
        N_A -->|SE_DEROULE_A| N_L
        N_I -->|A_TEMOIGNE| N_T((Temoignage))
        N_T -->|CONCERNE| N_A
    end

    style N_I fill:#f0f0f0,stroke:#000,stroke-width:2px
    style N_A fill:#f0f0f0,stroke:#000,stroke-width:2px
    style N_L fill:#e0f7fa,stroke:#000,stroke-width:2px
    style N_T fill:#e3f2fd,stroke:#000,stroke-width:2px
```
