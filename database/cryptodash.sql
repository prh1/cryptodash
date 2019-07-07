--
-- PostgreSQL database dump
--

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

--
-- Name: holding_create(integer, character varying, numeric); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION holding_create(integer, character varying, numeric) RETURNS integer
    LANGUAGE sql
    AS $_$

INSERT INTO holding (portfolio_id, coin, amount) SELECT $1, $2, $3
	WHERE NOT EXISTS (
		SELECT * FROM holding WHERE portfolio_id = $1 AND coin = $2
	) RETURNING holding_id

$_$;


--
-- Name: holding_delete(integer); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION holding_delete(id integer) RETURNS integer
    LANGUAGE sql
    AS $$

DELETE FROM holding WHERE holding_id = id RETURNING holding_id;

$$;


--
-- Name: holding_holding_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE holding_holding_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: holding; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE holding (
    holding_id integer DEFAULT nextval('holding_holding_id_seq'::regclass) NOT NULL,
    portfolio_id integer,
    coin character varying(20),
    amount numeric(35,15)
);


--
-- Name: holding_read(integer); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION holding_read(portfolio_id integer) RETURNS SETOF holding
    LANGUAGE sql
    AS $_$

SELECT holding_id, portfolio_id, coin, amount FROM holding WHERE portfolio_id = $1;

$_$;


--
-- Name: holding_update_amount(integer, numeric); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION holding_update_amount(id integer, new_amount numeric) RETURNS integer
    LANGUAGE sql
    AS $$

UPDATE holding SET amount = new_amount WHERE holding_id = id RETURNING holding_id;

$$;


--
-- Name: portfolio_create(character varying); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION portfolio_create(name character varying) RETURNS integer
    LANGUAGE sql
    AS $$

INSERT INTO portfolio (name, creation_time) VALUES (name, CURRENT_TIMESTAMP) RETURNING portfolio_id;

$$;


--
-- Name: portfolio; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

CREATE TABLE portfolio (
    portfolio_id integer NOT NULL,
    name character varying(50),
    creation_time timestamp without time zone
);


--
-- Name: porfolio_porfolio_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE porfolio_porfolio_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: porfolio_porfolio_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE porfolio_porfolio_id_seq OWNED BY portfolio.portfolio_id;


--
-- Name: portfolio_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY portfolio ALTER COLUMN portfolio_id SET DEFAULT nextval('porfolio_porfolio_id_seq'::regclass);


--
-- Name: holding_pkey; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY holding
    ADD CONSTRAINT holding_pkey PRIMARY KEY (holding_id);


--
-- Name: porfolio_pkey; Type: CONSTRAINT; Schema: public; Owner: -; Tablespace: 
--

ALTER TABLE ONLY portfolio
    ADD CONSTRAINT porfolio_pkey PRIMARY KEY (portfolio_id);


--
-- Name: fk_portfolio_portfolio_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY holding
    ADD CONSTRAINT fk_portfolio_portfolio_id FOREIGN KEY (portfolio_id) REFERENCES portfolio(portfolio_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: public; Type: ACL; Schema: -; Owner: -
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM postgres;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

