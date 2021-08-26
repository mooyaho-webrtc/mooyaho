import prisma from '../lib/prisma'

const sessionService = {
  async integrate(sessionId: string, userJSONString: string) {
    const parsed = JSON.parse(userJSONString)
    if (parsed.id === undefined) {
      const e = new Error('There is no id field in user json')
      throw e
    }
    // 사용자 존재 여부
    let user = await prisma.user.findUnique({
      where: {
        id: parsed.id,
      },
    })
    // 있으면 업데이트하고, 없으면 새로 생성
    if (user) {
      await prisma.user.update({
        where: {
          id: parsed.id,
        },
        data: {
          json: userJSONString,
        },
      })
    } else {
      user = await prisma.user.create({
        data: {
          id: parsed.id,
          json: userJSONString,
        },
      })
    }

    let session = await prisma.session.findUnique({ where: { id: sessionId } })
    if (!session) {
      session = await prisma.session.create({
        data: {
          id: sessionId,
          userId: user.id,
          state: JSON.stringify({
            muted: false,
            videoOff: false,
          }),
        },
      })
    }

    return {
      sessionId: session.id,
      user: parsed,
    }
  },

  async reintegrate(sessionId: string, prevSessionId: string) {
    const prevSession = await prisma.session.findUnique({
      where: { id: prevSessionId },
      include: {
        user: true,
      },
    })
    if (!prevSession) return false
    await prisma.session.create({
      data: {
        id: sessionId,
        userId: prevSession.userId,
        state: JSON.stringify({
          muted: false,
          videoOff: false,
        }),
      },
    })
    return JSON.parse(prevSession.user.json)
  },

  async getUserBySessionId(sessionId: string) {
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: {
        user: true,
      },
    })
    if (!session) {
      return null
    }
    const parsed: SessionUser = JSON.parse(session.user.json)
    return parsed
  },

  async updateState(sessionId: string, key: string, value: any) {
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
    })
    if (!session) return
    const prevState = JSON.parse(session.state)
    const nextState = JSON.stringify({
      ...prevState,
      [key]: value,
    })
    await prisma.session.update({
      where: { id: sessionId },
      data: {
        state: nextState,
      },
    })
  },
}

export type SessionUser = { id: string; [key: string]: any }

export default sessionService
